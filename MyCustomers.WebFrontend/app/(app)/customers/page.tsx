import type { Metadata } from "next";
import EntityListPage from "@/app/(app)/components/EntityListPage";
import { listCustomers } from "@/app/(app)/customers/lib/service";
import type { CustomerDto } from "@/app/(app)/customers/lib/types/CustomerDto";
import { ITEMS_PER_PAGE } from "@/app/lib/constants";

export const metadata: Metadata = { title: "Customers" };

export default async function Customers({
  searchParams,
}: PageProps<"/customers">) {
  const page = Number((await searchParams).page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const result = await listCustomers(skip, ITEMS_PER_PAGE);

  if (!result.success) {
    throw new Error(
      `Failed to load customers: ${JSON.stringify(result.error, null, 2)}`,
    );
  }

  const getItemName = (item: CustomerDto) => item.name;

  const getItemDetails = (item: CustomerDto) => [
    { label: "Email", value: item.email ?? "Unknown" },
    { label: "Number", value: item.number ?? "Unknown" },
    { label: "Notes", value: item.notes ?? "Unknown" },
    // Format CreatedDate as a human readable string
    { label: "Created Date", value: new Date(item.createdDate).toLocaleString() ?? "Unknown" },
    { label: "Modified Date", value: new Date(item.modifiedDate).toLocaleString() ?? "Unknown" },
  ];

  return (
    <EntityListPage
      data={result.data}
      itemsPerPage={ITEMS_PER_PAGE}
      page={page}
      createHref="/customers/new"
      pageHrefTemplate="/customers?page={page}"
      itemHrefTemplate="/customers/{id}"
      getItemName={getItemName}
      getItemDetails={getItemDetails}
      entityName="Customer"
      entityNamePlural="Customers"
    />
  );
}
