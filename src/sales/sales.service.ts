import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const sale = new Sale();
    sale.customerName = createSaleDto.customerName;
    sale.items = [];

    for (const si of createSaleDto.items) {
      const item = await this.itemRepository.findOne({ where: { id: si.itemId } });
      if (!item) throw new NotFoundException(`Item con id ${si.itemId} no encontrado`);

      if (item.stock < si.quantity) {
        throw new Error(`Stock insuficiente para el item ${item.name}. Disponible: ${item.stock}`);
      }

      const saleItem = new SaleItem();
      saleItem.item = item;
      saleItem.quantity = si.quantity;
      saleItem.price = item.price;

      item.stock -= si.quantity;
      await this.itemRepository.save(item);

      sale.items.push(saleItem);
    }

    return this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({ relations: ['items', 'items.item'] });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { id }, relations: ['items', 'items.item'] });
    if (!sale) throw new NotFoundException(`Venta con id ${id} no encontrada`);
    return sale;
  }
}
