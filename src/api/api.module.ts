import { Module } from "@nestjs/common";
import { FileTransformerModule } from "./modules/file.transform.module/file-transform.module";
@Module({
  imports: [FileTransformerModule],
})
export class ApiModule {}
