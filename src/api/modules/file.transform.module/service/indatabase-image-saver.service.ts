import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
// import { Image } from "../model/image.schema";
import { SaverInterface } from "../interface/database.saver.interface";
import { ResponseDto } from "../dto/response.dto";
import { Express } from "express";
import { FileMedia } from "../model/file.schema";
@Injectable()
export class ImageSaverService implements SaverInterface {
  constructor(
    // @InjectModel(Image.name) private imageModel: Model<Image>,
    @InjectModel(FileMedia.name) private fileModel: Model<FileMedia>
  ) {}

  async saveToDatabase(
    data: Record<string, string | number | Express.Multer.File>
  ): Promise<ResponseDto> {
    console.log(this.fileModel);
    const document = await this.fileModel.findOne({ uId: data.uID });
    if (document) {
      throw new BadRequestException();
    }
    // const model = new this.imageModel(data);
    // await model.save();
    return new ResponseDto(data);
  }
}
