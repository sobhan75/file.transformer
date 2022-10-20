import { Express } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { FileMedia } from "../model/file.schema";
import { Model } from "mongoose";
import { ResponseDto } from "../dto/response.dto";
import { InputDto } from "../dto/credentials.dto";
import {
  NotFoundException,
  InternalServerErrorException,
  StreamableFile,
} from "@nestjs/common";
import { minioClientMaker } from "../helperfunctions/minio-client-maker";
import * as sharp from "sharp";
import type { Response } from "express";
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

  async getFile(input: InputDto, response: Response): Promise<StreamableFile> {
    let fileArray: Uint8Array[];
    const document = await this.fileModel.findOne({ uID: input.uID });
    if (!document) {
      throw new NotFoundException();
    }
    const client = minioClientMaker();
    client.getObject("my-bucket", document.uID, function (error, dataStream) {
      if (error) {
        throw new InternalServerErrorException();
      }
      dataStream.on("data", function (chunk) {
        fileArray.push(chunk);
      });
    });
    const fileBuffer = Buffer.concat(fileArray);
    response.set({
      "Content-Type": `${document.MimeType}`,
      "Content-Disposition": 'attachment; filename="package.json"',
    });
    if (
      document.MimeType.split("/")[0] === "image" &&
      input.width &&
      input.height
    ) {
      const resizedFile = await sharp(fileBuffer).resize(
        input.width,
        input.height
      );
      return new StreamableFile(resizedFile);
    }
    return new StreamableFile(fileBuffer);
  }
}
