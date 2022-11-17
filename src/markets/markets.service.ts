import { Injectable } from '@nestjs/common';
import { SearchMarket } from './dto/search-market.dto';
import { MarketsRepository } from './markets.repository';

@Injectable()
export class MarketsService {
  constructor(private readonly repository: MarketsRepository) {}

  async searchMarket(search: SearchMarket) {
    try {
      return await this.repository.searchMarket(search);
    } catch (error) {
      throw error;
    }
  }
}
