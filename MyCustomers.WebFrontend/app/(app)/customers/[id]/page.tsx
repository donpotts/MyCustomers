import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { validate as uuidValidate } from "uuid";
import EntityPage from "@/app/(app)/components/EntityPage";
import {
  deleteCustomer,
  getCustomer,
} from "@/app/(app)/customers/lib/service";

export async function generateMetadata({
  params,
}: PageProps<"/customers/[id]">): Promise<Metadata> {
  const { id } = await params;

  if (!uuidValidate(id)) {
    return {};
  }
  const result = await getCustomer(id);

  if (!result.success) {
    return {};
  }

  return { title: result.data.name };
}

export default async function Customer({
  params,
}: PageProps<"/customers/[id]">) {
  const { id } = await params;

  if (!uuidValidate(id)) {
    notFound();
  }

  const customerResult = await getCustomer(id);

  if (!customerResult.success) {
    notFound();
  }

  const customer = customerResult.data;

  const deleteAction = async () => {
    "use server";

    await deleteCustomer(id);
    redirect("/customers");
  };

  const details = [
    {
      label: "Email",
      value: customer.email ?? "Unknown",
    },
    {
      label: "Number",
      value: customer.number ?? "Unknown",
    },
    {
      label: "Notes",
      value: customer.notes ?? "",
    },
    {
      label: "Created Date",
      // Format CreatedDate as a human readable string
      value: new Date(customer.createdDate).toLocaleString() ?? "Unknown",
    },
    {
      label: "Modified Date",
      // Format ModifiedDate as a human readable string
      value: new Date(customer.modifiedDate).toLocaleString() ?? "Unknown",
    },
  ];

  return (
    <EntityPage
      back={{ label: "Customers", href: "/customers" }}
      title={customer.name}
      editHref={`/customers/${id}/edit`}
      deleteAction={deleteAction}
      details={details}
    />
  );
}
