import * as bcrypt from "bcrypt";
export async function hashPassword(input: string): Promise<string> {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(input, salt);
}
