'use client';

import { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

export function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    const iconUrl = settings.branding.iconUrl;
    if (!iconUrl) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }, [settings.branding.iconUrl]);

  return null;
}
