import { StorefrontLayout } from "@/components/storefront/storefront-layout";
import { JsonLd } from "@/components/storefront/json-ld";

export default function StorefrontLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd />
      <StorefrontLayout>{children}</StorefrontLayout>
    </>
  );
}
