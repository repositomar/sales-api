import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsString()
  brand: string;

  @IsNumber()  
  price: number;
}