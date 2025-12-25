'use client';

import { useEffect, useRef } from 'react';
import { logVisit } from '@/app/actions';

export default function AnalyticsTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double firing in React strict mode
    if (!initialized.current) {
      initialized.current = true;
      logVisit().catch(console.error);
    }
  }, []);

  return null;
}
