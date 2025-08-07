
'use client';

import { useState } from 'react';
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
import { Loader2, KeyRound, Mail } from 'lucide-react';
import Image from 'next/image';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang kembali!',
      });
      router.push('/');
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
      // Format nomor telepon ke format E.164 jika perlu (contoh: +6281234567890)
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+62${phoneNumber.replace(/^0/, '')}`;
      
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      window.recaptchaVerifier = recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      
      router.push(`/verify-otp?phoneNumber=${formattedPhoneNumber}`);

    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim OTP',
        description: 'Pastikan nomor telepon valid dan coba lagi. Mungkin ada masalah dengan reCAPTCHA.',
      });
    } finally {
      setIsLoading(false);
    }
  };


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
              <Mail className="mr-2 h-4 w-4" />
            )}
            Masuk dengan Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
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

          <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  );
}
