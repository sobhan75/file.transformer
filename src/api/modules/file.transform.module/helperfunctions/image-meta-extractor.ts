import * as sizeOf from "buffer-image-size";

export function imageMetadataExtract(file: Buffer): {
  width: number;
  height: number;
  type: string;
} {
  return sizeOf(file);
}
