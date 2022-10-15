import { ResponseDto } from "../dto/response.dto";
export interface SaverInterface {
  saveToDatabase(
    metadata: Record<string, number | string>
  ): Promise<ResponseDto>;
}
