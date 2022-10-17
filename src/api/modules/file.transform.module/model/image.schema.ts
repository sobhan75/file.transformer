import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema()
export class Image {
  // media: string;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: Number, required: true })
  width: number;
}
export const imageSchema = SchemaFactory.createForClass(Image);
