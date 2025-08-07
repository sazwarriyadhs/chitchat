
"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[101] flex items-center justify-center bg-background transition-opacity duration-500 ease-out animate-fade-out'
      )}
      style={{ animationFillMode: 'forwards', animationDelay: '2.5s' }}
    >
      <div className={cn('animate-splash-pop-in')}>
        <Image src="/image/logo.png" alt="ChitChat Logo" width={240} height={240} className="w-60 h-auto" />
      </div>
    </div>
  );
}
