import { Controller, Get, UseFilters, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { SearchMarket } from './dto/search-market.dto';

// HttpExceptionFilter 을 컨트롤러에서 적용.
@UseFilters(new HttpExceptionFilter())
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  async searchMarket(@Query() search: SearchMarket) {
    return await this.marketsService.searchMarket(search);
  }
}
