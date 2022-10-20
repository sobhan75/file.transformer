import { Express } from "express";
import { ResponseDto } from "../dto/response.dto";
import { FileTypeService } from "./file-type.service";
import { Media } from "../enums/media";
import { ImageFileTypeService } from "../service/image-file-type.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FileMedia } from "../model/file.schema";
import { md5Hash } from "../helperfunctions/md5-hash-creator";
import { ConfigService } from "@nestjs/config";
import { minioClientMaker } from "../helperfunctions/minio-client-maker";
import { saveToObjectStorage } from "../helperfunctions/object-storage-saver";
import { InputDto } from "../dto/credentials.dto";
import type { Response } from "express";
export class FileService {
  constructor(
    private fileTypeService: FileTypeService,
    private imageFileTypeService: ImageFileTypeService,
    @InjectModel(FileMedia.name) private fileMediaModel: Model<FileMedia>,
    private configService: ConfigService
  ) {}

  getFileTypeService(mimetype: Media): FileTypeService | ImageFileTypeService {
    const mediaMap: {
      [k in Media]?: FileTypeService | ImageFileTypeService;
    } = {
      [Media.IMAGE]: this.imageFileTypeService,
      [Media.VIDEO]: this.fileTypeService,
      [Media.APPLICATION]: this.fileTypeService,
    };

    return mediaMap[mimetype] ?? this.fileTypeService;
  }

  async set(file: Express.Multer.File): Promise<ResponseDto> {
    const mimeTypeFirstPart = file.mimetype.split("/")[0];
    const fileHash = md5Hash(file.buffer);
    const foundDocument = await this.fileMediaModel.findOne({ uID: fileHash });
    if (foundDocument) {
      return new ResponseDto(foundDocument.toJSON());
    }
    const service = this.getFileTypeService(Media[mimeTypeFirstPart]);
    const extractedMetadata = service.extractMetaData(file);
    const client = minioClientMaker();
    await saveToObjectStorage(client, file.buffer, fileHash);
    return await service.saveFileToDB({ ...extractedMetadata, uID: fileHash });
  }

  async get(input: InputDto, response: Response) {
    return await this.fileTypeService.getFile(input, response);
  }
}
