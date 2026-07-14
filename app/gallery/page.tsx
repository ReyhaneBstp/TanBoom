import { getPublicDesigns } from "@/server/services/design-service";

export default async function GalleryPage() {
  const publicDesigns = await getPublicDesigns();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">گالری عمومی</h1>
      {publicDesigns.length === 0 ? (
        <p className="text-gray-500">هنوز طرحی منتشر نشده است.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publicDesigns.map((design) => (
            <div key={design.id} className="rounded-xl bg-white shadow p-4">
              <img
                src={design.frontImage}
                alt={design.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h2 className="mt-3 font-semibold">{design.title}</h2>
              <p className="text-xs text-gray-500">
                طراح: {design.creatorName ?? "کاربر تن‌بوم"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
