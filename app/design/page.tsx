import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DesignStepper } from "@/features/design/DesignStepper";

export default async function DesignerRoute() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/design");
  }

  return <DesignStepper />;
}
