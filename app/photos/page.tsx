import { AddGalleryPhotosForm } from "@/components/trip/add-gallery-photos-form";
import { GalleryGrid } from "@/components/trip/gallery-grid";
import { PageContainer } from "@/components/trip/page-container";
import { readTrip } from "@/lib/trip/store";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const trip = await readTrip();

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold tracking-tight">사진</h1>
      <AddGalleryPhotosForm />
      <GalleryGrid photos={trip.galleryPhotos} />
    </PageContainer>
  );
}
