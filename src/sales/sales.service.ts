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
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const sale = new Sale();
    sale.customerName = createSaleDto.customerName;
    sale.items = [];
    let total = 0;

    for (const si of createSaleDto.items) {
      const item = await this.itemRepository.findOne({ where: { id: si.itemId } });
      if (!item) throw new NotFoundException(`Item con id ${si.itemId} no encontrado`);

      const saleItem = new SaleItem();
      saleItem.item = item;
      saleItem.quantity = si.quantity;
      saleItem.price = item.price;

      item.stock -= si.quantity;
      await this.itemRepository.save(item);

      total += si.quantity * Number(item.price);

      sale.items.push(saleItem);
    }

    sale.total = total;
    console.log(10, sale)
    return this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({ relations: ['items', 'items.item'] });
  }

  async findOne(saleId: string): Promise<any> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['items', 'items.item'],
    });

    if (!sale) throw new NotFoundException(`Venta con id ${saleId} no encontrada`);

    const mappedItems = sale.items.map(si => ({
      id: si.id,
      quantity: si.quantity,
      price: si.price,
      item: {
        id: si.item.id,
        name: si.item.name,
        brand: si.item.brand,
      }
    }));

    return {
      id: sale.id,
      customerName: sale.customerName,
      createdAt: sale.createdAt,
      total: sale.total,
      items: mappedItems,
    };
  }
}
