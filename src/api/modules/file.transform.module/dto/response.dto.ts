import { BaseInterface } from "../interface/base.interface";
import { Expose } from "class-transformer";
export class ResponseDto implements BaseInterface {
  constructor(partial: Partial<ResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  MimeType: string;

  @Expose()
  uID: string;

  @Expose()
  size: number;
}
