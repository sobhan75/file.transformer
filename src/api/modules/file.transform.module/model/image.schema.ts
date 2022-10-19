import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FileMedia } from "./file.schema";
@Schema()
export class Image extends FileMedia {
  // media: string;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: Number, required: true })
  width: number;
}
export const imageSchema = SchemaFactory.createForClass(Image);
