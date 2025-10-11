import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { Item } from './entities';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService
  ) {}

  @Post()
  createItem(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Get()
  getItems(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<Item[]> {
    return this.itemService.findAll(page, limit, search);
  }

  @Get(':itemId')
  getItem(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.findOne(itemId);
  }

  @Put(':itemId')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto
  ): Promise<Item> {
    return this.itemService.update(itemId, updateItemDto)
  }
}
