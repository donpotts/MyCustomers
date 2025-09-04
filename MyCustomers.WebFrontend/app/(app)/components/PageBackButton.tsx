import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { Button } from "@mui/material";
import NextLink from "next/link";

export interface PageBackButtonProps {
  label: string;
  href: string;
}

export default function PageBackButton({ label, href }: PageBackButtonProps) {
  return (
    <Button
      variant="text"
      startIcon={<ChevronLeft />}
      component={NextLink}
      href={href}
      sx={{ mb: 2 }}
    >
      Back to {label}
    </Button>
  );
}
