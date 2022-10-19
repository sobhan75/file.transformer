import * as sizeOf from "buffer-image-size";

export function imageMetadataExtract(file: Buffer): {
  width: number;
  height: number;
} {
  const output = sizeOf(file);
  return { width: output.width, height: output.height };
}
