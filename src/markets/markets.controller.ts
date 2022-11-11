import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseFilters,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketCustomException } from './market-exception';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';

import { Logger, LoggerService } from '@nestjs/common';

// HttpExceptionFilter 을 컨트롤러에서 적용.
@UseFilters(new HttpExceptionFilter())
@Controller('markets')
export class MarketsController {
  constructor(
    private readonly marketsService: MarketsService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  create(@Body() createMarketDto: CreateMarketDto) {
    this.printLoggerServiceLog(createMarketDto);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('ERROR: ' + JSON.stringify(dto), e.stack);
    } finally {
      this.logger.warn('WARN:' + JSON.stringify(dto));
      this.logger.log('log: ' + JSON.stringify(dto));
      this.logger.verbose('VERBOSE: ' + JSON.stringify(dto));
      this.logger.debug('DEBUG: ' + JSON.stringify(dto));
    }
  }

  @Get()
  findAll() {
    return this.marketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketsService.remove(+id);
  }
}
