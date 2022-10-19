import { imageMetadataExtract } from "../helperfunctions/image-meta-extractor";
import { FileTypeService } from "./file-type.service";
import { Express } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../model/image.schema";
import { Model } from "mongoose";
import { ResponseDto } from "../dto/response.dto";
export class ImageFileTypeService extends FileTypeService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {
    super();
  }

  extractMetaData(file: Express.Multer.File): {
    size: number;
    MimeType: string;
    width: number;
    height: number;
  } {
    const extractorContent = imageMetadataExtract(file.buffer);
    return {
      size: file.size,
      MimeType: file.mimetype,
      width: extractorContent.width,
      height: extractorContent.height,
    };
  }

  async saveFileToDB(metaData: unknown): Promise<ResponseDto> {
    const response = await this.imageModel.create(metaData);
    return new ResponseDto(response.toJSON());
  }
}
