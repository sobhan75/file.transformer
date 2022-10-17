import { InternalServerErrorException } from "@nestjs/common";
import { Client } from "minio";
export async function saveToObjectStorage(
  accessKey: string,
  secretKey: string,
  endpoint: string,
  file: Buffer,
  fileHash: string
): Promise<void> {
  // throw new InternalServerErrorException("my custom error occured!");

  const storageClient = new Client({
    accessKey: accessKey,
    secretKey: secretKey,
    endPoint: endpoint,
    useSSL: true,
  });
  try {
    const operationResult = await storageClient.bucketExists("my-bucket");
    if (!operationResult) {
      await storageClient.makeBucket("my-bucket", "us-east-1");
    }
    const result = await storageClient.putObject("my-bucker", fileHash, file);
    console.log(result);
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(error.message);
  }
}
