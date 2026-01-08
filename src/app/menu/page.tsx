import MenuClient from "@/app/menu/MenuClient";

type MenuPageProps = {
  searchParams?: Promise<{
    mesa?: string | string[];
  }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const mesaParam =
    typeof resolvedParams?.mesa === "string" ? resolvedParams.mesa : null;

  return <MenuClient mesaParam={mesaParam} />;
}
