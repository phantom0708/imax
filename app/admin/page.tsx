'use client';
import { Metadata } from 'next';
import { useEffect } from "react";
import { AuthService } from "@/shared/services";
import { useRouter } from "next/navigation";
export const metadata: Metadata = {
  title: 'quan tri',
  description: 'quan tri nextjs13',
};
export default function Page() {
  const {getOauth } = AuthService();
  const router = useRouter();
  useEffect(() => {
    var auth = getOauth();
    if (!auth){
      router.push('/login');
    }
  }, []);
    return <h1>Hello, admin</h1>;
  }