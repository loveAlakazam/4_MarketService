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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { User } from '../auth/decorators/auth.decorator';
import { SellerGuard } from '../auth/guards/local-auth.guard';

@UseFilters(new HttpExceptionFilter())
@Controller('products')
@ApiTags('상품 API')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * @url : [POST] /api/products/
   * @description: 셀러는 상품을 등록합니다.
   */
  @UseGuards(SellerGuard)
  @Post()
  @ApiOperation({
    summary: '상품등록 API',
    description: '셀러회원만 요청이 가능한 API 이며, 상품을 등록합니다.',
  })
  async create(@User() user, @Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(user, createProductDto);
  }

  /**
   * @url : [PATCH] /api/products/:id
   * @description: 상품을 등록한 셀러는 상품을 수정합니다.
   */
  @UseGuards(SellerGuard)
  @Patch(':id')
  @ApiOperation({
    summary: '상품 수정 API',
    description:
      '셀러회원만 요청이 가능한 API 이며, 상품정보를 수정할 수 있습니다.',
  })
  async update(
    @Param('id') id: string,
    @User() user,
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
  @ApiOperation({
    summary: '상품삭제 API',
    description:
      '셀러회원만 요청이 가능한 API 이며, 상품을 삭제합니다. 삭제이후 조회, 수정이 불가능합니다.',
  })
  async remove(@Param('id') id: string, @User() user) {
    return await this.productsService.remove(user, id);
  }

  /**
   *
   * @url : [GET] /api/products/:id
   * @description: 상품에 대한 상세정보입니다.
   * 삭제된 상품은 조회할 수 없습니다.
   */
  @Get(':id')
  @ApiOperation({
    summary: '상품 상세조회 API',
    description:
      '비회원을 포함한 모든 회원이 조회가능하며, 상품아이디에 맞는 상품에 대한 상세정보를 조회할 수 있습니다.',
  })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  /**
   * @url : [GET] /api/products/
   * @description: 모든상품을 조회할 수 있습니다.
   * @todo: pagination을 추가해봅시다.
   */
  @Get()
  @ApiOperation({
    summary: '전체 상품조회 API',
    description:
      '비회원을 포함한 모든 회원이 조회가능하며, 삭제되지 않은 모든 상품들을 조회할 수 있습니다.',
  })
  async findAll() {
    return await this.productsService.findAll();
  }
}
