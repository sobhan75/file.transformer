import { BadRequestException, Injectable } from "@nestjs/common";
import { Express } from "express";
import { UserPass } from "../dto/user.password.dto";
import { imageMetadataExtract } from "../helperfunctions/image-meta-extractor";
import { hashPassword } from "../helperfunctions/hash-password-creator";
import { md5Hash } from "../helperfunctions/md5-hash-creator";
import { SaverService } from "./indatabase-saver.service";
import { ResponseDto } from "../dto/response.dto";
import { applicationMimeTypeExtract } from "../helperfunctions/application-mimetype-extractor";
import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../model/image.schema";
import { Model } from "mongoose";
import { FileMedia } from "../model/file.schema";
type FileProcessorHelper = (file?: Buffer) => Record<string, string | number>;
enum Media {
  IMAGE = "image",
  VIDEO = "video",
  APPLICATION = "application",
}
@Injectable()
export class DiscriminateService {
  constructor(
    private saverService: SaverService,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    @InjectModel(FileMedia.name) private fileMediaModel: Model<FileMedia>
  ) {}

  async mimeTypeDiscriminator(
    file: Express.Multer.File,
    password: UserPass
  ): Promise<ResponseDto> {
    if (!file) {
      throw new BadRequestException();
    }
    const fileMainType = file.mimetype.split("/")[0];
    //mapping maintypes to proper methods
    const mediaMap: {
      [k in Media]?: {
        meta: FileProcessorHelper;
        mongoModel: Model<Image> | Model<FileMedia>;
      };
    } = {
      [Media.IMAGE]: {
        meta: imageMetadataExtract,
        mongoModel: this.imageModel,
      },
      [Media.APPLICATION]: {
        meta: applicationMimeTypeExtract,
        mongoModel: this.fileMediaModel,
      },
    };
    if (!mediaMap[fileMainType]) {
      throw new BadRequestException();
    }
    const metadata = mediaMap[fileMainType].meta(file.buffer);
    // console.log(metadata);

    const fileHash = md5Hash(file.buffer);
    const hashedPassword = await hashPassword(password.password);
    // if (metadata === undefined) {
    //   return this.imageSaverService.saveToDatabase({
    //     uID: fileHash,
    //     MimeType: file.mimetype,
    //     hashedPassword,
    //     size: file.size,
    //   });
    // }
    return this.saverService.saveToDatabase(
      {
        uID: fileHash,
        MimeType: file.mimetype,
        hashedPassword,
        size: file.size,
        ...metadata,
      },
      mediaMap[fileMainType].mongoModel,
      file.buffer
    );
  }
}
