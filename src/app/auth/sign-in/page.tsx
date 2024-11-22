'use client'

import { Authenticator } from "@aws-amplify/ui-react"
import { useSearchParams } from "next/navigation"
import "@aws-amplify/ui-react/styles.css"
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect"

export default function SignIn() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/'
  useAuthRedirect(nextUrl)

  return (
    <main className="auth-page">
      <Authenticator hideSignUp initialState="signIn" />
    </main>
  )
}