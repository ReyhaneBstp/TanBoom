import { auth } from "@/auth";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { getUserDesigns } from "@/server/services/design-service";
import { getUserOrders } from "@/server/services/order-service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const [designs, orders] = await Promise.all([
    getUserDesigns(session.user.id),
    getUserOrders(session.user.id),
  ]);

  return (
    <DashboardView
      userName={session.user.name ?? null}
      designs={designs}
      orders={orders}
    />
  );
}
