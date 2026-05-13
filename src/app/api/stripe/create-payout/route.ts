import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const {
    action, amount, currency, recipientId, recipientName, recipientEmail,
    country, customerId, dateOfBirth, address, tosAcceptedIp,
    bankAccount, payoutMethodId,
  } = await request.json();

  try {
    if (action === 'create-recipient') {
      if (!customerId) {
        return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
      }

      const names = (recipientName || 'Demo User').split(' ');
      const givenName = names[0];
      const surname = names.slice(1).join(' ') || 'User';

      const recipient = await stripe.v2.core.accounts.create({
        display_name: recipientName || 'Withdrawal Recipient',
        contact_email: recipientEmail || 'withdrawal@example.com',
        identity: {
          country: country || 'gb',
          entity_type: 'individual',
          individual: {
            given_name: givenName,
            surname,
            ...(dateOfBirth && {
              date_of_birth: {
                day: dateOfBirth.day,
                month: dateOfBirth.month,
                year: dateOfBirth.year,
              },
            }),
            ...(address && {
              address: {
                line1: address.line1,
                ...(address.line2 && { line2: address.line2 }),
                city: address.city,
                ...(address.state && { state: address.state }),
                postal_code: address.postalCode,
                country: (country || 'gb').toUpperCase(),
              },
            }),
          },
          attestations: {
            terms_of_service: {
              account: {
                date: new Date().toISOString(),
                ip: tosAcceptedIp || '0.0.0.0',
              },
            },
          },
        },
        configuration: {
          recipient: {
            capabilities: {
              bank_accounts: {
                local: { requested: true },
              },
            },
          },
        },
        metadata: {
          customer_id: customerId,
          source: 'paddy-power-demo',
        },
        include: ['identity', 'configuration.recipient', 'requirements'],
      });

      await stripe.customers.update(customerId, {
        metadata: {
          recipient_id: recipient.id,
        },
      });

      return NextResponse.json({ recipientId: recipient.id });
    }

    if (action === 'create-payout-method') {
      if (!recipientId || !bankAccount) {
        return NextResponse.json({ error: 'Recipient ID and bank account details are required' }, { status: 400 });
      }

      const bankCountry = (bankAccount.country || country || 'gb').toUpperCase();

      // For GB accounts, use the Vault API with Confirmation of Payee
      if (bankCountry === 'GB') {
        const gbBankAccount = await stripe.v2.core.vault.gbBankAccounts.create(
          {
            account_number: bankAccount.accountNumber,
            sort_code: bankAccount.routingNumber,
            currency: bankAccount.currency || currency || 'gbp',
            confirmation_of_payee: {
              initiate: true,
            },
          },
          { stripeContext: recipientId },
        );

        const copStatus = gbBankAccount.confirmation_of_payee?.status;
        const copResult = gbBankAccount.confirmation_of_payee?.result;

        return NextResponse.json({
          payoutMethodId: gbBankAccount.id,
          status: copStatus === 'confirmed' ? 'succeeded' : 'requires_action',
          confirmationOfPayee: {
            status: copStatus,
            matchResult: copResult?.match_result || null,
            matchedName: copResult?.matched?.name || null,
            providedName: copResult?.provided?.name || null,
            message: copResult?.message || null,
          },
        });
      }

      // For non-GB accounts, use OutboundSetupIntents
      const outboundSetupIntent = await stripe.v2.moneyManagement.outboundSetupIntents.create(
        {
          payout_method_data: {
            type: 'bank_account',
            bank_account: {
              country: bankCountry,
              currency: bankAccount.currency || currency || 'gbp',
              account_number: bankAccount.accountNumber,
              ...(bankAccount.routingNumber && { routing_number: bankAccount.routingNumber }),
              ...(bankAccount.branchNumber && { branch_number: bankAccount.branchNumber }),
              ...(bankAccount.swiftCode && { swift_code: bankAccount.swiftCode }),
            },
          },
          usage_intent: 'payment',
        },
        { stripeContext: recipientId },
      );

      return NextResponse.json({
        payoutMethodId: outboundSetupIntent.payout_method.id,
        status: outboundSetupIntent.status,
      });
    }

    if (action === 'acknowledge-cop') {
      if (!recipientId || !payoutMethodId) {
        return NextResponse.json({ error: 'Recipient ID and payout method ID are required' }, { status: 400 });
      }

      const acknowledged = await stripe.v2.core.vault.gbBankAccounts.acknowledgeConfirmationOfPayee(
        payoutMethodId,
        {},
        { stripeContext: recipientId },
      );

      return NextResponse.json({
        payoutMethodId: acknowledged.id,
        status: acknowledged.confirmation_of_payee?.status,
      });
    }

    if (action === 'send-payout') {
      if (!recipientId || !payoutMethodId) {
        return NextResponse.json({ error: 'Recipient ID and payout method ID are required' }, { status: 400 });
      }

      const financialAccounts = await stripe.v2.moneyManagement.financialAccounts.list();
      const financialAccount = financialAccounts.data.find(
        (fa) => fa.status === 'open'
      );

      if (!financialAccount) {
        return NextResponse.json({ error: 'No open financial account found' }, { status: 400 });
      }

      const outboundPayment = await stripe.v2.moneyManagement.outboundPayments.create(
        {
          from: {
            currency: currency || 'gbp',
            financial_account: financialAccount.id,
          },
          to: {
            recipient: recipientId,
            payout_method: payoutMethodId,
            currency: currency || 'gbp',
          },
          amount: {
            value: amount,
            currency: currency || 'gbp',
          },
          description: 'Withdrawal payout',
          metadata: {
            type: 'withdrawal',
            source: 'paddy-power-demo',
          },
        }
      );

      return NextResponse.json({
        id: outboundPayment.id,
        status: outboundPayment.status,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payout failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
