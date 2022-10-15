import { ClassSerializerInterceptorOptions } from "@nestjs/common";

export const transformOptions: ClassSerializerInterceptorOptions = {
  enableCircularCheck: true,
  excludeExtraneousValues: true,
  exposeUnsetFields: false,
};
