import { Base } from "src/common/model/base.schema";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { BaseInterface } from "../interface/base.interface";
@Schema({ timestamps: true, discriminatorKey: "media" })
export class FileMedia extends Base implements BaseInterface {
  // @Prop({
  //   type: String,
  //   required: true,
  //   enum: [typeEnum.IMAGE],
  // })
  media: string;

  @Prop({ type: String, required: true })
  MimeType: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, required: true })
  uID: string;
}
export const fileSchema = SchemaFactory.createForClass(FileMedia);
