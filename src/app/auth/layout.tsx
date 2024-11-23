'use client';

import '@/src/styles/auth.css';
import { usePathname } from 'next/navigation';

const BANNER_CONTENT = {
  '/auth/sign-in': {
    title: 'Welcome Back',
    description: 'Sign in to continue tracking your athletic performance metrics'
  },
  '/auth/sign-up': {
    title: 'Get Started',
    description: 'Create an account to begin measuring your athletic output'
  },
  '/auth/forgot-password': {
    title: 'Reset Password',
    description: 'We&apos;ll help you get back to tracking your performance'
  },
  '/auth/confirm': {
    title: 'Confirm Account',
    description: 'Enter the confirmation code sent to your email'
  }
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const content = BANNER_CONTENT[pathname as keyof typeof BANNER_CONTENT] || {
    title: 'Output Score',
    description: 'A quantitative approach to measuring athletic performance through physics-based metrics'
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <div className="banner-content">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </div>
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
} 