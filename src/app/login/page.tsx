
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } from 'useAuth';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      router.push('/chat');
      return;
    }

    if (!window.recaptchaVerifier && recaptchaContainerRef.current && !authLoading && !user) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          'size': 'invisible',
          'callback': () => { /* reCAPTCHA solved */ },
          'expired-callback': () => {
             toast({
                variant: "destructive",
                title: "reCAPTCHA Expired",
                description: "Silakan coba lagi.",
            });
           }
        });
        window.recaptchaVerifier.render().catch((error) => {
            console.error("reCAPTCHA render error:", error);
            toast({
                variant: "destructive",
                title: "reCAPTCHA Gagal",
                description: "Tidak dapat merender reCAPTCHA. Coba muat ulang halaman.",
            });
        });
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier", error);
        toast({
            variant: "destructive",
            title: "reCAPTCHA Gagal",
            description: "Tidak dapat menginisialisasi reCAPTCHA. Coba muat ulang halaman."
        })
      }
    }
  }, [user, authLoading, router, toast]);


  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Pengalihan sekarang akan ditangani oleh AuthProvider / ProtectedLayout
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang kembali!',
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba masuk dengan Google.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Nomor Telepon Diperlukan',
        description: 'Silakan masukkan nomor telepon Anda.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+62${phoneNumber.replace(/^0/, '')}`;
      
      const recaptchaVerifier = window.recaptchaVerifier;
      if (!recaptchaVerifier) {
          throw new Error("reCAPTCHA verifier not initialized. Silakan muat ulang halaman.");
      }
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      
      router.push(`/verify-otp?phoneNumber=${formattedPhoneNumber}`);

    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Gagal mengirim OTP. Pastikan nomor telepon valid dan coba lagi.';
      if (error instanceof Error && error.message.includes('reCAPTCHA')) {
        errorMessage = 'Terjadi masalah dengan verifikasi reCAPTCHA. Muat ulang halaman dan coba lagi.';
      }
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim OTP',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (authLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <Image src="/image/logo.png" alt="ChitChat Logo" width={160} height={160} className="mx-auto mb-4 w-40 h-auto" />
          <CardTitle>Selamat Datang!</CardTitle>
          <CardDescription>Masuk untuk melanjutkan ke ChitChat</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleGoogleSignIn} variant="outline" disabled={isGoogleLoading || isLoading}>
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 54.7l-73.1 67.9C294.5 99.4 271.2 86 248 86c-82.6 0-150.2 67.6-150.2 150.2S165.4 406.4 248 406.4c96.3 0 132.2-69.3 136-105.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            )}
            Masuk dengan Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                atau lanjutkan dengan
              </span>
            </div>
          </div>
          
          <div className="grid gap-2">
             <Input
                id="phone"
                type="tel"
                placeholder="Nomor Telepon (e.g. 0812...)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            <Button onClick={handlePhoneSignIn} disabled={isLoading || isGoogleLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Masuk dengan Nomor Telepon
            </Button>
          </div>
        </CardContent>
      </Card>
      <div ref={recaptchaContainerRef}></div>
    </div>
  );
}
