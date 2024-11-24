"use client"

import { Amplify } from "aws-amplify";
import "@/src/styles/app.css";
import "@/src/styles/irontribe.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { ThemeProvider } from "../contexts/ThemeContext";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Authenticator.Provider>
      </body>
    </html>
  );
}

