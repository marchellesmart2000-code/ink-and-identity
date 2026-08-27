import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

type ImageAsset = {
  storageId: Id<"_storage">;
  alt: string;
  caption?: string;
  sortOrder: number;
};

export type PublicImage = {
  url: string;
  alt: string;
  caption?: string;
  sortOrder: number;
  storageId: Id<"_storage">;
};

export async function resolveImage(
  ctx: QueryCtx | MutationCtx,
  image: ImageAsset | undefined,
): Promise<PublicImage | null> {
  if (!image) {
    return null;
  }
  const url = await ctx.storage.getUrl(image.storageId);
  if (!url) {
    return null;
  }
  return {
    url,
    alt: image.alt,
    caption: image.caption,
    sortOrder: image.sortOrder,
    storageId: image.storageId,
  };
}

export async function resolveGallery(
  ctx: QueryCtx | MutationCtx,
  gallery: ImageAsset[],
): Promise<PublicImage[]> {
  const resolved = await Promise.all(
    gallery
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => resolveImage(ctx, image)),
  );
  return resolved.filter((image): image is PublicImage => image !== null);
}
