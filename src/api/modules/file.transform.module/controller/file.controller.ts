import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  Query,
  Post,
  Get,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { DiscriminateService } from "../service/dicriminator.service";
import { UserPass } from "../dto/user.password.dto";
import { ResponseDto } from "../dto/response.dto";
import type { Response } from "express";
import { InputDto } from "../dto/credentials.dto";
import { FileDownloadService } from "../service/file-download.service";
@Controller("/files")
export class FileController {
  constructor(
    private discriminateService: DiscriminateService,
    private fileDownloadService: FileDownloadService
  ) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    password: UserPass
  ): Promise<ResponseDto> {
    return this.discriminateService.mimeTypeDiscriminator(file, password);
  }

  @Get("/download")
  downloadFile(
    @Res({ passthrough: true }) response: Response,
    @Query() input: InputDto
  ) {
    return this.fileDownloadService.fetchFile(response, input);
  }
}
