'use client'

import { Authenticator } from "@aws-amplify/ui-react"
import { useSearchParams } from "next/navigation"
import "@aws-amplify/ui-react/styles.css"
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect"

export default function ConfirmSignUp() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/'
  useAuthRedirect(nextUrl)

  return (
    <div className="auth-form-container">
      <h2>Confirm Sign Up</h2>
      <Authenticator hideSignUp initialState="signUp" />
    </div>
  )
} 