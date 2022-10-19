import { imageMetadataExtract } from "../helperfunctions/image-meta-extractor";
import { FileTypeService } from "./file-type.service";
import { Express } from "express";
export class ImageFileTypeService extends FileTypeService {
  extractMetaData(file: Express.Multer.File): {
    size: number;
    mimeType: string;
    width: number;
    height: number;
  } {
    const extractorContent = imageMetadataExtract(file.buffer);
    return {
      size: file.size,
      mimeType: file.mimetype,
      width: extractorContent.width,
      height: extractorContent.height,
    };
  }
}
