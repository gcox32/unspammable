"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

// const client = generateClient<Schema>();

export default function HomePage() {
  const { signOut } = useAuthenticator();
  
  return (
    <main>
      <div>
        🥳 App successfully hosted.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Proceed.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
