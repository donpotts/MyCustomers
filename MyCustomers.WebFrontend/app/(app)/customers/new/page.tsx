import { Box } from "@mui/material";
import type { Metadata } from "next";
import PageBackButton from "@/app/(app)/components/PageBackButton";
import PageHeader from "@/app/(app)/components/PageHeader";
import CustomerForm from "../components/CustomerForm";
import { createCustomer } from "./actions";

export const metadata: Metadata = { title: "Create Customer" };

export default function NewCustomer() {
  return (
    <>
      <PageBackButton label="Customers" href="/customers" />
      <PageHeader title="Create Customer" />
      <Box sx={{ maxWidth: 400 }}>
        <CustomerForm
          submitLabel="Create"
          submitPendingLabel="Creating..."
          action={createCustomer}
          initialState={{}}
        />
      </Box>
    </>
  );
}
