import { Box } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { validate as uuidValidate } from "uuid";
import PageBackButton from "@/app/(app)/components/PageBackButton";
import PageHeader from "@/app/(app)/components/PageHeader";
import CustomerForm from "../../components/CustomerForm";
import { getCustomer } from "../../lib/service";
import { updateCustomer } from "./actions";

export async function generateMetadata({
  params,
}: PageProps<"/customers/[id]/edit">): Promise<Metadata> {
  const { id } = await params;

  if (!uuidValidate(id)) {
    return {};
  }
  const result = await getCustomer(id);

  if (!result.success) {
    return {};
  }

  return { title: `Edit ${result.data.name}` };
}

export default async function EditCustomer({
  params,
}: PageProps<"/customers/[id]/edit">) {
  const { id } = await params;

  if (!uuidValidate(id)) {
    notFound();
  }

  const result = await getCustomer(id);

  if (!result.success) {
    notFound();
  }

  const customer = result.data;

  const updateCustomerWithId = updateCustomer.bind(null, id);

  const initialState = {
    data: {
      name: customer.name,
      email: customer.email,
      number: customer.number ?? undefined,
      note: customer.notes ?? undefined,
      createdDate: customer.createdDate,
      // Use current datetime
      modifiedDate: new Date().toISOString(),
    },
  };

  return (
    <>
      <PageBackButton label={customer.name} href={`/customers/${id}`} />
      <PageHeader title={`Edit ${customer.name}`} />
      <Box sx={{ maxWidth: 400 }}>
        <CustomerForm
          submitLabel={"Save"}
          submitPendingLabel={"Saving..."}
          action={updateCustomerWithId}
          initialState={initialState}
        />
      </Box>
    </>
  );
}
