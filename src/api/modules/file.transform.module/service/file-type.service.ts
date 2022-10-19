import { Express } from "express";
export class FileTypeService {
  extractMetaData(file: Express.Multer.File): {
    size: number;
    mimeType: string;
  } {
    return { size: file.size, mimeType: file.mimetype };
  }
}
