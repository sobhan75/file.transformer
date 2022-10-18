import * as bcrypt from "bcrypt";
export async function passwordCompare(
  password: string,
  databasePassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, databasePassword);
}
