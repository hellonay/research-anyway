"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { mutateTrip, savePhoto } from "@/lib/trip/store";
import { ITEM_TYPES, type ItemType } from "@/lib/trip/types";

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : null;
}

function parseItemType(value: FormDataEntryValue | null): ItemType {
  return (ITEM_TYPES as readonly string[]).includes(String(value))
    ? (value as ItemType)
    : "기타";
}

async function collectPhotos(formData: FormData) {
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const photos = [];
  for (const file of files) {
    const url = await savePhoto(file);
    if (url) photos.push({ id: randomUUID(), url });
  }
  return photos;
}

export async function updateTripInfo(formData: FormData) {
  const title = optionalText(formData.get("title"));
  const periodStart = optionalText(formData.get("periodStart"));
  const periodEnd = optionalText(formData.get("periodEnd"));
  const coverFile = formData.get("coverImage");
  const coverUrl =
    coverFile instanceof File && coverFile.size > 0
      ? await savePhoto(coverFile)
      : null;

  await mutateTrip((trip) => {
    if (title) trip.title = title;
    trip.periodStart = periodStart;
    trip.periodEnd = periodEnd;
    if (coverUrl) trip.coverImage = coverUrl;
    return trip;
  });

  revalidatePath("/");
}

export async function addDay(formData: FormData) {
  const label = optionalText(formData.get("label"));
  if (!label) return;

  await mutateTrip((trip) => {
    trip.days.push({ id: randomUUID(), label, items: [] });
    return trip;
  });

  revalidatePath("/");
}

export async function updateDay(dayId: string, formData: FormData) {
  const label = optionalText(formData.get("label"));
  if (!label) return;

  await mutateTrip((trip) => {
    const day = trip.days.find((d) => d.id === dayId);
    if (day) day.label = label;
    return trip;
  });

  revalidatePath("/");
}

export async function deleteDay(dayId: string) {
  await mutateTrip((trip) => {
    trip.days = trip.days.filter((d) => d.id !== dayId);
    return trip;
  });

  revalidatePath("/");
}

export async function addItem(dayId: string, formData: FormData) {
  const title = optionalText(formData.get("title"));
  if (!title) return;

  const type = parseItemType(formData.get("type"));
  const startTime = optionalText(formData.get("startTime"));
  const endTime = optionalText(formData.get("endTime"));
  const note = optionalText(formData.get("note"));
  const mapUrl = optionalText(formData.get("mapUrl"));
  const photos = await collectPhotos(formData);

  await mutateTrip((trip) => {
    const day = trip.days.find((d) => d.id === dayId);
    if (!day) return trip;
    day.items.push({
      id: randomUUID(),
      title,
      type,
      startTime,
      endTime,
      note,
      mapUrl,
      photos,
      createdAt: Date.now(),
    });
    return trip;
  });

  revalidatePath("/");
}

export async function deleteItem(dayId: string, itemId: string) {
  await mutateTrip((trip) => {
    const day = trip.days.find((d) => d.id === dayId);
    if (day) day.items = day.items.filter((i) => i.id !== itemId);
    return trip;
  });

  revalidatePath("/");
}

export async function updateItem(
  dayId: string,
  itemId: string,
  formData: FormData
) {
  const title = optionalText(formData.get("title"));
  if (!title) return;

  const type = parseItemType(formData.get("type"));
  const startTime = optionalText(formData.get("startTime"));
  const endTime = optionalText(formData.get("endTime"));
  const note = optionalText(formData.get("note"));
  const mapUrl = optionalText(formData.get("mapUrl"));
  const newPhotos = await collectPhotos(formData);

  await mutateTrip((trip) => {
    const day = trip.days.find((d) => d.id === dayId);
    const item = day?.items.find((i) => i.id === itemId);
    if (!item) return trip;
    item.title = title;
    item.type = type;
    item.startTime = startTime;
    item.endTime = endTime;
    item.note = note;
    item.mapUrl = mapUrl;
    item.photos = [...item.photos, ...newPhotos];
    return trip;
  });

  revalidatePath("/");
}

export async function deleteItemPhoto(
  dayId: string,
  itemId: string,
  photoId: string
) {
  await mutateTrip((trip) => {
    const day = trip.days.find((d) => d.id === dayId);
    const item = day?.items.find((i) => i.id === itemId);
    if (item) item.photos = item.photos.filter((p) => p.id !== photoId);
    return trip;
  });

  revalidatePath("/");
}

export async function addPerson(formData: FormData) {
  const name = optionalText(formData.get("name"));
  if (!name) return;

  await mutateTrip((trip) => {
    trip.people.push({
      id: randomUUID(),
      name,
      infoNotes: [],
      createdAt: Date.now(),
    });
    return trip;
  });

  revalidatePath("/info");
}

export async function updatePerson(personId: string, formData: FormData) {
  const name = optionalText(formData.get("name"));
  if (!name) return;

  await mutateTrip((trip) => {
    const person = trip.people.find((p) => p.id === personId);
    if (person) person.name = name;
    return trip;
  });

  revalidatePath("/info");
}

export async function deletePerson(personId: string) {
  await mutateTrip((trip) => {
    trip.people = trip.people.filter((p) => p.id !== personId);
    return trip;
  });

  revalidatePath("/info");
}

export async function addInfoNote(personId: string, formData: FormData) {
  const title = optionalText(formData.get("title"));
  const text = optionalText(formData.get("text"));
  const link = optionalText(formData.get("link"));
  const photos = await collectPhotos(formData);
  if (!title && !text && !link && photos.length === 0) return;

  await mutateTrip((trip) => {
    const person = trip.people.find((p) => p.id === personId);
    if (!person) return trip;
    person.infoNotes.push({
      id: randomUUID(),
      title,
      text,
      link,
      photos,
      createdAt: Date.now(),
    });
    return trip;
  });

  revalidatePath("/info");
}

export async function updateInfoNote(
  personId: string,
  noteId: string,
  formData: FormData
) {
  const title = optionalText(formData.get("title"));
  const text = optionalText(formData.get("text"));
  const link = optionalText(formData.get("link"));
  const newPhotos = await collectPhotos(formData);

  await mutateTrip((trip) => {
    const person = trip.people.find((p) => p.id === personId);
    const note = person?.infoNotes.find((n) => n.id === noteId);
    if (!note) return trip;
    note.title = title;
    note.text = text;
    note.link = link;
    note.photos = [...note.photos, ...newPhotos];
    return trip;
  });

  revalidatePath("/info");
}

export async function deleteInfoNote(personId: string, noteId: string) {
  await mutateTrip((trip) => {
    const person = trip.people.find((p) => p.id === personId);
    if (person) person.infoNotes = person.infoNotes.filter((n) => n.id !== noteId);
    return trip;
  });

  revalidatePath("/info");
}

export async function deleteInfoNotePhoto(
  personId: string,
  noteId: string,
  photoId: string
) {
  await mutateTrip((trip) => {
    const person = trip.people.find((p) => p.id === personId);
    const note = person?.infoNotes.find((n) => n.id === noteId);
    if (note) note.photos = note.photos.filter((p) => p.id !== photoId);
    return trip;
  });

  revalidatePath("/info");
}

export async function addGalleryPhotos(formData: FormData) {
  const caption = optionalText(formData.get("caption"));
  const photos = await collectPhotos(formData);
  if (photos.length === 0) return;

  await mutateTrip((trip) => {
    for (const photo of photos) {
      trip.galleryPhotos.push({
        id: photo.id,
        url: photo.url,
        caption,
        createdAt: Date.now(),
      });
    }
    return trip;
  });

  revalidatePath("/photos");
}

export async function deleteGalleryPhoto(photoId: string) {
  await mutateTrip((trip) => {
    trip.galleryPhotos = trip.galleryPhotos.filter((p) => p.id !== photoId);
    return trip;
  });

  revalidatePath("/photos");
}
