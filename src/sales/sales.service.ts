import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    let totalAmount = 0;

    const products = await Promise.all(
      createSaleDto.items.map(si =>
        this.itemRepository.findOne({ where: { id: si.itemId } }),
      ),
    );

    for (let i = 0; i < createSaleDto.items.length; i++) {
      const saleItemDto = createSaleDto.items[i];
      const product = products[i];

      if (!product) {
        throw new NotFoundException(`Item con id ${saleItemDto.itemId} no encontrado`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`El item ${product.name} no está activo`);
      }

      if (product.stock < saleItemDto.quantity) {
        throw new BadRequestException(
          `No hay suficiente stock para el item ${product.name}. Stock disponible: ${product.stock}`,
        );
      }
    }

    for (let i = 0; i < createSaleDto.items.length; i++) {
      const saleItemDto = createSaleDto.items[i];
      const product = products[i]!;

      const saleItemEntity = new SaleItem();
      saleItemEntity.item = product;
      saleItemEntity.quantity = saleItemDto.quantity;
      saleItemEntity.price = product.price;

      product.stock -= saleItemDto.quantity;
      await this.itemRepository.save(product);

      totalAmount += saleItemDto.quantity * Number(product.price);
      sale.items.push(saleItemEntity);
    }

    sale.total = totalAmount;
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

    const mappedItems = sale.items.map(saleItemDto => ({
      id: saleItemDto.id,
      quantity: saleItemDto.quantity,
      price: saleItemDto.price,
      item: {
        id: saleItemDto.item.id,
        name: saleItemDto.item.name,
        brand: saleItemDto.item.brand,
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
