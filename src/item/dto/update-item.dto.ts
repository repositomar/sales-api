import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  stock: number;
}