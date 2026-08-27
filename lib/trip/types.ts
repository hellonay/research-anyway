export const ITEM_TYPES = ["이동", "식사", "여가", "휴식", "쇼핑", "기타"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface Photo {
  id: string;
  url: string;
}

export interface Item {
  id: string;
  title: string;
  type: ItemType;
  startTime: string | null;
  endTime: string | null;
  note: string | null;
  mapUrl: string | null;
  photos: Photo[];
  createdAt: number;
}

export interface Day {
  id: string;
  label: string;
  items: Item[];
}

export interface InfoNote {
  id: string;
  title: string | null;
  text: string | null;
  photos: Photo[];
  createdAt: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  createdAt: number;
}

export interface Trip {
  title: string;
  periodStart: string | null;
  periodEnd: string | null;
  coverImage: string | null;
  days: Day[];
  infoNotes: InfoNote[];
  galleryPhotos: GalleryPhoto[];
}
