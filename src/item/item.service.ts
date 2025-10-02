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

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find(); 
  }

  async update(itemId: string, updateItemDto: UpdateItemDto): Promise<Item> {
    console.log({itemId, updateItemDto})
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
