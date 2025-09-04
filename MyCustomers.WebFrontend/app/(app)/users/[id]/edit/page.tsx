import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getServiceEndpoint } from "@/app/lib/service-discovery";
import { getUserById } from "../../lib/service";
import EditUserClient from "./EditUserClient";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit User page component.
 */
export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  
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

  // Get the user to edit
  const result = await getUserById(id);
  
  if (!result.success) {
    if (result.error.status === 404) {
      notFound();
    }
    throw new Error(`Failed to load user: ${JSON.stringify(result.error, null, 2)}`);
  }

  return <EditUserClient user={result.data} id={id} />;
}