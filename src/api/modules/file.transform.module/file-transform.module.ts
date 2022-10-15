import { Module } from "@nestjs/common";
import { FileController } from "./controller/file.controller";
import { DiscriminateService } from "./service/dicriminator.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FileMedia, fileSchema } from "./model/file.schema";
import { Image, imageSchema } from "./model/image.schema";
import { ImageSaverService } from "./service/indatabase-image-saver.service";
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FileMedia.name,
        schema: fileSchema,
        discriminators: [{ name: Image.name, schema: imageSchema }],
      },
    ]),
  ],
  controllers: [FileController],
  providers: [DiscriminateService, ImageSaverService],
})
export class FileTransformerModule {}
