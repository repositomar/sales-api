import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities';
import { Repository } from 'typeorm';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>
  ) {}

  async create(createItem: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(createItem);
    return this.itemRepository.save(item);
  }

  async findOne(itemId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException(`Item con id ${itemId} no encontrado`);
    }

    return item;
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
  ): Promise<any> {
    const query = this.itemRepository.createQueryBuilder('item');

    if (search) {
      query.where('item.name LIKE :search', { search: `%${search}%` })
    }

    query.orderBy('item.created_at', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async update(itemId: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.preload({
      id: itemId,
      ...updateItemDto,
    });

    if (!item) {
      throw new NotFoundException(`Item con id ${itemId} no encontrado`);
    }

    return this.itemRepository.save(item);
  }
}
