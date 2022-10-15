import { Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ timestamps: true })
export class Base extends Document {}
