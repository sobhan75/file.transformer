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
import { Client } from "minio";
import { saveToObjectStorage } from "../helperfunctions/object-storage-saver";
import { InputDto } from "../dto/credentials.dto";
export class FileService {
  constructor(
    private fileTypeService: FileTypeService,
    private imageFileTypeService: ImageFileTypeService,
    @InjectModel(FileMedia.name) private fileMediaModel: Model<FileMedia>,
    private configService: ConfigService
  ) {}

  minioClientMaker(): Client {
    const accessKey = this.configService.get("ACCESS_KEY");
    const secretKey = this.configService.get("SECRET_KEY");
    const endpoint = this.configService.get("endpoint");
    return new Client({
      accessKey: accessKey,
      secretKey: secretKey,
      endPoint: endpoint,
      useSSL: true,
    });
  }

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
    const client = this.minioClientMaker();
    await saveToObjectStorage(client, file.buffer, fileHash);
    return await service.saveFileToDB({ ...extractedMetadata, uID: fileHash });
  }
  get(input: InputDto) {
    
  }
}
