import { Express } from "express";
import { ResponseDto } from "../dto/response.dto";
import { FileTypeService } from "./file-type.service";
import { Media } from "../enums/media";
import { ImageFileTypeService } from "../service/image-file-type.service";
import { BadRequestException } from "@nestjs/common";
import { Image } from "../model/image.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FileMedia } from "../model/file.schema";
import { md5Hash } from "../helperfunctions/md5-hash-creator";
export class FileService {
  constructor(
    private fileTypeService: FileTypeService,
    private imageFileTypeService: ImageFileTypeService,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    @InjectModel(FileMedia.name) private fileMediaModel: Model<FileMedia>
  ) {}

  set(file: Express.Multer.File): ResponseDto {
    const mimeTypeFirstPart = file.mimetype.split("/")[0];
    const mediaMap: {
      [k in Media]?: {
        service: FileTypeService;
        model: Model<FileMedia>;
      };
    } = {
      [Media.IMAGE]: {
        service: this.imageFileTypeService,
        model: this.imageModel,
      },
      [Media.VIDEO]: {
        service: this.fileTypeService,
        model: this.fileMediaModel,
      },
      [Media.APPLICATION]: {
        service: this.fileTypeService,
        model: this.fileMediaModel,
      },
    };
    if (!mediaMap[mimeTypeFirstPart]) {
      throw new BadRequestException("File type not supported.");
    }
    const extractedMetadata =
      mediaMap[mimeTypeFirstPart].service.extractedMetadata(file);
    const fileHash = md5Hash(file.buffer);
    const individualModel = mediaMap[mimeTypeFirstPart].model;
    //check if user not uploading a repetitive file
    if (individualModel.findOne({ uID: fileHash }))
      throw new BadRequestException();
    const individualModelInstance = new individualModel(extractedMetadata);
    individualModelInstance.save();
    if (!extractedMetadata) {
      //returning multer info about file
      return new ResponseDto({ MimeType: file.mimetype, size: file.size });
    }
    //returning extra metadata
    return new ResponseDto(extractedMetadata);
  }
}
