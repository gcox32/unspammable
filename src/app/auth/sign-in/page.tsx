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
    <div className="auth-form-container">
      <h2>Sign In</h2>
      <Authenticator hideSignUp initialState="signIn" />
    </div>
  )
}