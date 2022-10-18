import { InternalServerErrorException } from "@nestjs/common";
import { Client } from "minio";
export async function saveToObjectStorage(
  storageClient: Client,
  file: Buffer,
  fileHash: string
): Promise<void> {
  // throw new InternalServerErrorException("my custom error occured!");
  try {
    const operationResult = await storageClient.bucketExists("my-bucket");
    if (!operationResult) {
      await storageClient.makeBucket("my-bucket", "us-east-1");
    }
    await storageClient.putObject("my-bucket", fileHash, file);
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}
