import { Expose } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { UserInput } from "./user.input.dto";
export class InputDto extends UserInput {
  @IsNumber()
  @Expose()
  @IsOptional()
  height: number;

  @IsNumber()
  @Expose()
  @IsOptional()
  width: number;
}
