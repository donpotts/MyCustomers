import type { Metadata } from "next";
import { auth } from "@/auth";
import AuthSessionProvider from "./components/AuthSessionProvider";
import MuiProvider from "./components/MuiProvider";

export const metadata: Metadata = {
  title: { default: "My Customers", template: "%s | My Customers" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <MuiProvider>
          <AuthSessionProvider session={session}>
            {children}
          </AuthSessionProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
