import AppShell from "./components/layout/AppShell";

export default function Layout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
