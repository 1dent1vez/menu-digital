import CartClient from "@/app/cart/CartClient";

type CartPageProps = {
  searchParams?: Promise<{
    mesa?: string | string[];
  }>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const resolvedParams = await searchParams;
  const mesaParam =
    typeof resolvedParams?.mesa === "string" ? resolvedParams.mesa : null;

  return <CartClient mesaParam={mesaParam} />;
}
