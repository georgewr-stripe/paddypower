'use client';

import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcJcb,
  FaCcPaypal,
  FaCcApplePay,
  FaCcStripe,
  FaGooglePay,
  FaApplePay,
  FaAmazon,
  FaBitcoin,
  FaCreditCard,
  FaUniversity,
  FaMoneyCheck,
  FaWallet,
} from 'react-icons/fa';
import {
  SiKlarna,
  SiAlipay,
  SiWechat,
  SiSamsung,
  SiCashapp,
  SiRevolut,
} from 'react-icons/si';

const brandColors: Record<string, string> = {
  visa: 'text-[#1A1F71]',
  mastercard: 'text-[#EB001B]',
  amex: 'text-[#006FCF]',
  discover: 'text-[#FF6600]',
  jcb: 'text-[#0E4C96]',
  paypal: 'text-[#003087]',
  apple_pay: 'text-white',
  google_pay: 'text-white',
  link: 'text-[#00D66F]',
  klarna: 'text-[#FFB3C7]',
  affirm: 'text-[#0FA0EA]',
  afterpay_clearpay: 'text-[#B2FCE4]',
  cashapp: 'text-[#00D632]',
  revolut_pay: 'text-white',
  alipay: 'text-[#1677FF]',
  wechat_pay: 'text-[#07C160]',
  amazon_pay: 'text-[#FF9900]',
  samsung_pay: 'text-[#1428A0]',
  crypto: 'text-[#F7931A]',
  ideal: 'text-[#CC0066]',
  sepa_debit: 'text-[#2B6CB0]',
  bacs_debit: 'text-[#1E3A5F]',
  us_bank_account: 'text-[#1C4E80]',
  bancontact: 'text-[#005498]',
  eps: 'text-[#C8036F]',
  giropay: 'text-[#003A7D]',
  p24: 'text-[#D13239]',
  sofort: 'text-[#EF809F]',
  pix: 'text-[#32BCAD]',
  boleto: 'text-gray-400',
  zip: 'text-[#AA8FFF]',
};

export function PaymentMethodIcon({ type, brand, className = 'w-8 h-8' }: { type: string; brand?: string | null; className?: string }) {
  const resolvedKey = type === 'card' && brand ? brand.toLowerCase() : type;
  const color = brandColors[resolvedKey] || 'text-gray-400';
  const iconClass = `${className} ${color}`;

  // Card brands
  if (type === 'card' || type === 'card_present') {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return <FaCcVisa className={iconClass} />;
      case 'mastercard':
        return <FaCcMastercard className={iconClass} />;
      case 'amex':
      case 'american_express':
        return <FaCcAmex className={iconClass} />;
      case 'discover':
        return <FaCcDiscover className={iconClass} />;
      case 'jcb':
        return <FaCcJcb className={iconClass} />;
      default:
        return <FaCreditCard className={iconClass} />;
    }
  }

  // Wallets & BNPL
  switch (type) {
    case 'paypal':
      return <FaCcPaypal className={iconClass} />;
    case 'link':
      return <FaCcStripe className={`${className} text-[#00D66F]`} />;
    case 'apple_pay':
      return <FaApplePay className={iconClass} />;
    case 'google_pay':
      return <FaGooglePay className={iconClass} />;
    case 'amazon_pay':
      return <FaAmazon className={`${className} text-[#FF9900]`} />;
    case 'samsung_pay':
      return <SiSamsung className={`${className} text-[#1428A0]`} />;
    case 'klarna':
      return <SiKlarna className={`${className} text-[#FFB3C7]`} />;
    case 'affirm':
      return <FaMoneyCheck className={`${className} text-[#0FA0EA]`} />;
    case 'afterpay_clearpay':
      return <FaMoneyCheck className={`${className} text-[#B2FCE4]`} />;
    case 'cashapp':
      return <SiCashapp className={`${className} text-[#00D632]`} />;
    case 'revolut_pay':
      return <SiRevolut className={`${className} text-white`} />;
    case 'alipay':
      return <SiAlipay className={`${className} text-[#1677FF]`} />;
    case 'wechat_pay':
      return <SiWechat className={`${className} text-[#07C160]`} />;
    case 'crypto':
      return <FaBitcoin className={`${className} text-[#F7931A]`} />;
    case 'zip':
      return <FaWallet className={`${className} text-[#AA8FFF]`} />;

    // Bank-based methods
    case 'us_bank_account':
    case 'sepa_debit':
    case 'bacs_debit':
    case 'acss_debit':
    case 'au_becs_debit':
    case 'nz_bank_account':
    case 'pay_by_bank':
    case 'payto':
    case 'ideal':
    case 'bancontact':
    case 'eps':
    case 'giropay':
    case 'fpx':
    case 'p24':
    case 'sofort':
      return <FaUniversity className={iconClass} />;

    // Voucher / cash
    case 'boleto':
    case 'oxxo':
    case 'konbini':
    case 'multibanco':
      return <FaMoneyCheck className={iconClass} />;

    // Mobile wallets / QR
    case 'grabpay':
    case 'promptpay':
    case 'paynow':
    case 'pix':
    case 'blik':
    case 'mobilepay':
    case 'swish':
    case 'twint':
    case 'mb_way':
    case 'upi':
    case 'kakao_pay':
    case 'naver_pay':
    case 'payco':
    case 'paypay':
    case 'satispay':
      return <FaWallet className={iconClass} />;

    // Korean cards
    case 'kr_card':
      return <FaCreditCard className={iconClass} />;

    // Customer balance
    case 'customer_balance':
    case 'stripe_balance':
      return <FaCcStripe className={`${className} text-[#635BFF]`} />;

    default:
      return <FaCreditCard className={`${className} text-gray-400`} />;
  }
}
