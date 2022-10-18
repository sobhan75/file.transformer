import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { UserPass } from "./user.password.dto";
export class InputDto extends UserPass {
  @Expose()
  @IsString()
  uID: string;

  @IsNumber()
  @Expose()
  @IsOptional()
  height: number;

  @IsNumber()
  @Expose()
  @IsOptional()
  width: number;
}
