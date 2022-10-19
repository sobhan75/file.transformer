import { Express } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { FileMedia } from "../model/file.schema";
import { Model } from "mongoose";
import { ResponseDto } from "../dto/response.dto";
export class FileTypeService {
  constructor(
    @InjectModel(FileMedia.name) private fileModel?: Model<FileMedia>
  ) {}

  extractMetaData(file: Express.Multer.File): {
    size: number;
    MimeType: string;
  } {
    return { size: file.size, MimeType: file.mimetype };
  }

  async saveFileToDB(metaData: unknown): Promise<ResponseDto> {
    const response = await this.fileModel.create(metaData);
    return new ResponseDto(response.toJSON());
  }
}
