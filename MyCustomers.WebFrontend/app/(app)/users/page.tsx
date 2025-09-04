import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { UserDto } from "@/app/lib/types/UserDto";
import EntityListPage from "@/app/(app)/components/EntityListPage";
import { ITEMS_PER_PAGE } from "@/app/lib/constants";
import { listUsers } from "./lib/service";
import { getUserDisplayName, getUserRole } from "./lib/utils";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage({
  searchParams,
}: PageProps<"/users">) {
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

  const page = Number((await searchParams).page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const result = await listUsers(skip, ITEMS_PER_PAGE);

  if (!result.success) {
    throw new Error(
      `Failed to load users: ${JSON.stringify(result.error, null, 2)}`,
    );
  }

  const getItemName = (item: UserDto) => getUserDisplayName(item);

  const getItemDetails = (item: UserDto) => [
    { label: "Email", value: item.email || "Unknown" },
    { label: "Role", value: getUserRole(item) },
  ];

  return (
    <EntityListPage
      data={result.data}
      itemsPerPage={ITEMS_PER_PAGE}
      page={page}
      createHref="/users/new"
      pageHrefTemplate="/users?page={page}"
      itemHrefTemplate="/users/{id}"
      getItemName={getItemName}
      getItemDetails={getItemDetails}
      entityName="User"
      entityNamePlural="Users"
    />
  );
}