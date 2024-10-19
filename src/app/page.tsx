"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@/src/styles/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import SignOutButton from "@/src/components/auth/SignOutButton";

// const client = generateClient<Schema>();

export default function HomePage() {
  
  return (
    <main>
      <div>
        🥳 App successfully hosted.
      </div>
    </main>
  );
}
