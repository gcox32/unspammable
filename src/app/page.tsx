"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
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
        This is the app.
      </div>
    </main>
  );
}
