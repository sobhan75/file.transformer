import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { ResponseDto } from "../dto/response.dto";
import { saveToObjectStorage } from "../helperfunctions/object-storage-saver";
@Injectable()
export class ImageSaverService {
  constructor(private configService: ConfigService) {}

  async saveToDatabase(
    data: Record<string, string | number | Express.Multer.File>,
    model: Model<Document>,
    file: Buffer
  ): Promise<ResponseDto> {
    // console.log(this.fileModel, FileMedia.name);
    const document = await model.findOne({ uID: data.uID });
    if (document) {
      throw new BadRequestException();
    }
    //getting object storage connection credentials
    const accessKey = this.configService.get("ACCESS_KEY");
    const secretKey = this.configService.get("SECRET_KEY");
    const endpoint = this.configService.get("endpoint");
    try {
      await saveToObjectStorage(
        accessKey,
        secretKey,
        endpoint,
        file,
        data.uID as string
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    const modelVariable = new model(data);
    await modelVariable.save();
    return new ResponseDto(data);
  }
}
