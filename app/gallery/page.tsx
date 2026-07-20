import { getPublicDesigns } from "@/server/services/design-service";
import { unstable_cache } from "next/cache";
import { GalleryCard } from "@/features/gallery/GalleryCard";


const getCachedPublicDesigns = unstable_cache(getPublicDesigns, ["public-designs"], {  revalidate: 60,
});

export default async function GalleryPage() {
  const publicDesigns = await getCachedPublicDesigns();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">گالری طرح‌ها</h1>
      {publicDesigns.length === 0 ? (
        <p className="text-gray-500">هنوز طرحی منتشر نشده است.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publicDesigns.map((design) => (
            <GalleryCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}
