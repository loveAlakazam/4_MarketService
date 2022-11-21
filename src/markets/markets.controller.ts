import { Controller, Get, UseFilters, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { SearchMarket } from './dto/search-market.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

// HttpExceptionFilter 을 컨트롤러에서 적용.
@UseFilters(new HttpExceptionFilter())
@Controller('markets')
@ApiTags('마켓 API')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @ApiQuery({
    type: SearchMarket,
  })
  @ApiOperation({
    summary: '마켓 조회 API',
    description:
      '비회원을 포함한 모든 회원이 조회가능하며, 검색조건에 일치한 마켓데이터를 조회할 수 있으며, 마켓에 등록한 모든 상품을 조회할 수 있습니다.',
  })
  @ApiResponse({ status: 200, description: '마켓정보 조회 성공' })
  @ApiResponse({
    status: 400,
    description: '카테고리/국가/주문마감일 정렬옵션 에서 입력데이터 오류',
  })
  async searchMarket(@Query() search: SearchMarket) {
    return await this.marketsService.searchMarket(search);
  }
}
