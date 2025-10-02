import { IsNumber, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsNumber()  
  price: number;
}