// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
//   StreamableFile,
// } from "@nestjs/common";
// import { InputDto } from "../dto/credentials.dto";
// import type { Response } from "express";
// import { InjectModel } from "@nestjs/mongoose";
// import { FileMedia } from "../model/file.schema";
// import { Model } from "mongoose";
// import { passwordCompare } from "../helperfunctions/password-comparer";
// import { SaverService } from "./indatabase-saver.service";
// import * as sharp from "sharp";
// @Injectable()
// export class FileDownloadService {
//   constructor(
//     @InjectModel(FileMedia.name) private fileModel: Model<FileMedia>,
//     private saverService: SaverService
//   ) {}

//   async fetchFile(response: Response, input: InputDto) {
//     const document = await this.fileModel.findOne({ uId: input.uID });
//     let fileArray: Uint8Array[];
//     // console.log(document);
//     if (!document) {
//       throw new BadRequestException();
//     }
//     const passComparisonResult = await passwordCompare(
//       input.password,
//       document.hashedPassword
//     );
//     if (!passComparisonResult) {
//       throw new BadRequestException("Wrong password");
//     }
//     const minioClient = this.saverService.minioClientMaker();
//     minioClient.getObject(
//       "my-bucket",
//       document.uID,
//       function (error, dataStream) {
//         if (error) {
//           throw new InternalServerErrorException();
//         }
//         dataStream.on("data", function (chunk) {
//           fileArray.push(chunk);
//         });
//       }
//     );
//     const fileBuffer = Buffer.concat(fileArray);
//     response.set({
//       "Content-Type": `${document.MimeType}`,
//       "Content-Disposition": 'attachment; filename="package.json"',
//     });
//     if (
//       document.MimeType.split("/")[0] === "image" &&
//       input.width &&
//       input.height
//     ) {
//       const resizedFile = await sharp(fileBuffer).resize(
//         input.width,
//         input.height
//       );
//       return new StreamableFile(resizedFile);
//     }
//     return new StreamableFile(fileBuffer);
//   }
// }
