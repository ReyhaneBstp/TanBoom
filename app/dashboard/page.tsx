import { auth } from "@/auth";
import { getUserDesigns } from "@/server/services/design-service";
import { getUserOrders } from "@/server/services/order-service";
import { redirect } from "next/navigation";

const orderStatusLabels: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const [designs, orders] = await Promise.all([
    getUserDesigns(session.user.id),
    getUserOrders(session.user.id),
  ]);

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

      <h2 className="text-2xl font-bold mt-10 mb-6">سفارش‌های من</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white shadow p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">
                  {order.designTitle ?? "طرح حذف شده"}
                </h3>
                <p className="text-xs text-gray-500">
                  سایز: {order.size} — تعداد: {order.quantity}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {orderStatusLabels[order.status] ?? order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
