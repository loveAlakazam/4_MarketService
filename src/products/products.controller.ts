import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { User } from '../auth/decorators/auth.decorator';
import { User as Users } from '../users/schemas/user.schema';
import { SellerGuard } from '../auth/guards/local-auth.guard';

@UseFilters(new HttpExceptionFilter())
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * @url : [POST] /api/products/
   * @description: 셀러는 상품을 등록합니다.
   */
  @UseGuards(SellerGuard)
  @Post()
  async create(
    @User() user: Users,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(user, createProductDto);
  }

  /**
   * @url : [PATCH] /api/products/:id
   * @description: 상품을 등록한 셀러는 상품을 수정합니다.
   */
  @UseGuards(SellerGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() user: Users,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(user, id, updateProductDto);
  }

  /**
   * @url : [DELETE] /api/products/:id
   * @description: 상품을 등록한 셀러는 상품을 삭제합니다.
   */
  @UseGuards(SellerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: Users) {
    return await this.productsService.remove(user, id);
  }

  /**
   *
   * @url : [GET] /api/products/:id
   * @description: 상품에 대한 상세정보입니다.
   * 삭제된 상품은 조회할 수 없습니다.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
