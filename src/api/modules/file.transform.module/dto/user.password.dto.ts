import { IsString, MinLength, MaxLength, Validate } from "class-validator";
import { Expose } from "class-transformer";
import { passwordRequirement } from "src/constants/password-validation-options";
import { PasswordValidation } from "class-validator-password-check";
export class UserPass {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(PasswordValidation, [passwordRequirement])
  @Expose({ toClassOnly: true })
  password: string;
}
