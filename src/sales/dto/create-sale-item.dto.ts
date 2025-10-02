import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
