import { IsString } from "class-validator";
import { Expose } from "class-transformer";
export class UserInput {
  @IsString()
  @Expose()
  uID: string;
}
