
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function VerifyOtpComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Kode OTP Tidak Valid',
        description: 'Silakan masukkan 6 digit kode OTP.',
      });
      return;
    }
    setIsLoading(true);

    try {
      const confirmationResult = window.confirmationResult;
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang!',
        });
        router.push('/');
      } else {
        throw new Error('Konfirmasi tidak ditemukan. Silakan coba lagi dari halaman login.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Verifikasi Gagal',
        description: 'Kode OTP salah. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle>Verifikasi Nomor Telepon</CardTitle>
          <CardDescription>
            Masukkan 6 digit kode yang dikirim ke <br />
            <span className="font-semibold text-foreground">{phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            id="otp"
            type="text"
            placeholder="XXXXXX"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleVerifyOtp} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verifikasi Kode
          </Button>
          <Button variant="link" size="sm" onClick={() => router.push('/login')}>
            Kembali ke Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpComponent />
        </Suspense>
    )
}
