import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getServiceEndpoint } from "@/app/lib/service-discovery";
import CreateUserClient from "./CreateUserClient";

/**
 * Create User page component.
 */
export default async function CreateUserPage() {
  // Check if user is admin
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get current user info to check admin status
  const currentUserResponse = await fetch(`${getServiceEndpoint("webapi")}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (!currentUserResponse.ok) {
    redirect("/auth/signin");
  }

  const currentUser = await currentUserResponse.json();
  if (!currentUser.isAdmin) {
    redirect("/");
  }

  return <CreateUserClient />;
}