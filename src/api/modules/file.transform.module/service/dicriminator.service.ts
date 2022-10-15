import { BadRequestException, Injectable } from "@nestjs/common";
import { Express } from "express";
import { UserPass } from "../dto/user.password.dto";
import { imageMetadataExtract } from "../helperfunctions/image-meta-extractor";
import { hashPassword } from "../helperfunctions/hash-password-creator";
import { md5Hash } from "../helperfunctions/md5-hash-creator";
import { ImageSaverService } from "./indatabase-image-saver.service";
import { ResponseDto } from "../dto/response.dto";
type FileProcessorHelper = (file: Buffer) => Record<string, string | number>;
type FileSaver = (
  meta: Record<string, number | string | Express.Multer.File>
) => Promise<ResponseDto>;
enum Media {
  IMAGE = "image",
  VIDEO = "video",
}
@Injectable()
export class DiscriminateService {
  constructor(private imageSaverService: ImageSaverService) {}

  async mimeTypeDiscriminator(
    file: Express.Multer.File,
    password: UserPass
  ): Promise<void> {
    const fileMainType = file.mimetype.split("/")[0];
    //mapping maintypes to proper methods
    const mediaMap: {
      [k in Media]?: { saver: FileSaver; meta: FileProcessorHelper };
    } = {
      [Media.IMAGE]: {
        meta: imageMetadataExtract,
        saver: this.imageSaverService.saveToDatabase,
      },
    };
    if (!mediaMap[fileMainType]) {
      throw new BadRequestException("MimeType not supported!");
    }
    //passing individual media metadata to database saver
    const metadata = mediaMap[fileMainType].meta(file.buffer);
    const fileHash = md5Hash(file.buffer);
    const hashedPassword = await hashPassword(password.password);
    mediaMap[fileMainType].saver({
      uID: fileHash,
      Hpassword: hashedPassword,
      meta: metadata,
      multerData: file,
    });
  }
}
