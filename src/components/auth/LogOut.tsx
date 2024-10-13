'use client'
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import React from 'react'

const LogOut = () => {
    const router = useRouter()
    return (
        <button
        onClick={async () => {
            await signOut();
            router.push('/auth/signup')
        }}
          className="px-2 bg-white text-black"
        >
          Sign out
        </button>
      );
}

export default LogOut