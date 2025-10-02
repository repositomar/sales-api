import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }
}
