import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Res,
  Query,
  Post,
  Get,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
//import { DiscriminateService } from "../service/dicriminator.service";
import { ResponseDto } from "../dto/response.dto";
import type { Response } from "express";
import { InputDto } from "../dto/credentials.dto";
//import { FileDownloadService } from "../service/file-download.service";
import { FileService } from "../service/file.service";
@Controller("/files")
export class FileController {
  constructor(
    private fileService: FileService
  //private discriminateService: DiscriminateService,
    // private fileDownloadService: FileDownloadService
  ) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File): ResponseDto {
    return this.fileService.set(file);
    // return this.discriminateService.mimeTypeDiscriminator(file, password);
  }

  @Get("/download")
  downloadFile(
    @Res({ passthrough: true }) response: Response,
    @Query() input: InputDto
  ) {
    // return this.fileDownloadService.fetchFile(response, input);
  }
}
