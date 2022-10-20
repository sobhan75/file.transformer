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
  constructor(private fileService: FileService) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseDto> {
    return await this.fileService.set(file);
    // return this.discriminateService.mimeTypeDiscriminator(file, password);
  }

  @Get("/download")
  async downloadFile(
    @Res({ passthrough: true }) response: Response,
    @Query() input: InputDto
  ) {
    // return this.fileDownloadService.fetchFile(response, input);
    return await this.fileService.get(input, response);
  }
}
