import { Client } from "minio";
export function minioClientMaker(): Client {
  const accessKey = this.configService.get("ACCESS_KEY");
  const secretKey = this.configService.get("SECRET_KEY");
  const endpoint = this.configService.get("endpoint");
  return new Client({
    accessKey: accessKey,
    secretKey: secretKey,
    endPoint: endpoint,
    useSSL: true,
  });
}
