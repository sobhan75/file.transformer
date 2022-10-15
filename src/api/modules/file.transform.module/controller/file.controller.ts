import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Body,
} from "@nestjs/common";
import { Post } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { DiscriminateService } from "../service/dicriminator.service";
import { UserPass } from "../dto/user.password.dto";
@Controller("/files")
export class FileController {
  constructor(private discriminateService: DiscriminateService) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    password: UserPass
  ): void {
    this.discriminateService.mimeTypeDiscriminator(file, password);
  }
}
