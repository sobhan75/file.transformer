import * as md5 from "md5";
export function md5Hash(data: Buffer): string {
  return md5(data, { asString: true });
}
