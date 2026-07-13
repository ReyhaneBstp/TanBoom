import { auth } from "@/auth";
import { prisma } from "@/server/prisma/prisma";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const designs = await prisma.design.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">داشبورد شخصی</h1>
      {designs.length === 0 ? (
        <p className="text-gray-500">هنوز طرحی ذخیره نکرده‌اید.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="rounded-xl bg-white shadow p-4">
              <img
                src={design.frontImage}
                alt={design.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h2 className="mt-3 font-semibold">{design.title}</h2>
              <p className="text-xs text-gray-500">
                {design.isPublic ? "عمومی" : "خصوصی"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}