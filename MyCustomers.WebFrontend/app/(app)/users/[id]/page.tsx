import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import EntityPage from "../../components/EntityPage";
import { getUserById } from "../lib/service";
import { getUserDisplayName, getUserRole } from "../lib/utils";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * User details page component.
 */
export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  
  // Check if user is admin
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get current user info to check admin status
  const { getServiceEndpoint } = await import("@/app/lib/service-discovery");
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

  const result = await getUserById(id);
  
  if (!result.success) {
    if (result.error.status === 404) {
      redirect("/not-found");
    }
    throw new Error(`Failed to load user: ${JSON.stringify(result.error, null, 2)}`);
  }

  const user = result.data;

  const deleteAction = async () => {
    "use server";
    
    const deleteResponse = await fetch(`${getServiceEndpoint("webapi")}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete user");
    }

    revalidatePath("/users");
    redirect("/users");
  };

  const details = [
    { label: "Email", value: user.email || "Unknown" },
    { label: "Role", value: getUserRole(user) },
  ];

  return (
    <EntityPage
      back={{ label: "Users", href: "/users" }}
      title={getUserDisplayName(user)}
      editHref={`/users/${id}/edit`}
      deleteAction={deleteAction}
      details={details}
    />
  );
}