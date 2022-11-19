import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument } from './schemas/markets.schema';
import { Product } from '../products/schemas/product.schema';
import { AccessUser } from '../auth/dto/access-user.dto';
import { SearchMarket } from './dto/search-market.dto';
import { PER_PAGE } from './dto/market-pagination';

@Injectable()
export class MarketsRepository {
  constructor(
    // 마켓 다큐먼트 주입
    @InjectModel(Market.name)
    private readonly marketModel: Model<MarketDocument>,
  ) {}

  async createMarketData(seller: AccessUser, product: Product) {
    const newMarketData = await new this.marketModel({
      seller: seller._id,
      product: product,
    });

    await newMarketData.save();
  }

  async deleteMarketData(seller: AccessUser, productId: string) {
    await this.marketModel
      .updateOne(
        { product: productId, seller: seller._id },
        { deletedAt: Date.now() },
      )
      .exec();
  }

  async searchMarket(search: SearchMarket) {
    // (선택) 상품명(search.name) 가 null 이 아니라면 검색 쿼리 추가
    let searchNameQuery = null;
    if (search.name) {
      searchNameQuery = {
        'product.name': { $regex: '.*' + search.name + '.*' },
      };
    }

    // (선택) 상품 카테고리(search.category)가 null이 아니라면 검색 쿼리 추가
    let searchCategoryQuery = null;
    if (search.category) {
      searchCategoryQuery = {
        'product.category': { $in: [search.category] },
      };
    }

    // (선택) 상품 구매국가(search.buyCountry)가 null 이 아니라면 검색조건 추가
    let searchBuyCountryQuery = null;
    if (search.buyCountry) {
      searchBuyCountryQuery = {
        'product.buyCountry': { $in: [search.buyCountry] },
      };
    }

    const query = this.marketModel.aggregate([
      {
        $lookup: {
          from: 'users', // user 콜렉션과 join
          localField: 'seller',
          foreignField: '_id',
          as: 'seller',
        },
      },
      {
        $lookup: {
          from: 'products', // product 데이터과 join
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $project: {
          product: 1, // product 데이터를 갖는다.
          seller: {
            // 판매자의 _id, name, sellerNickname 컬럼만 추출한다. (일부컬럼 추출)
            _id: 1,
            name: 1,
            sellerNickname: 1,
          },
        },
      },
      {
        $match: {
          // 상품은 삭제되지 않은 상태 (삭제된 상태는 deletedAt 이 날짜로 표기됨)
          'product.deletedAt': null,
        },
      },
      {
        $match: {
          // 상품명 검색 쿼리
          ...searchNameQuery,

          // 상품 카테고리 검색 쿼리
          ...searchCategoryQuery,

          // 상품 구매국가 검색쿼리
          ...searchBuyCountryQuery,
        },
      },
    ]);

    // 페이지네이션 추가
    query
      .limit(PER_PAGE) // 한 페이지당 20개
      .skip(PER_PAGE * (search.page - 1));

    // 날짜 sort 옵션 추가
    let sortCloseDateQuery = null;
    if (search.closeDate) {
      sortCloseDateQuery = { 'product.closeDate': 1 };
    }

    return await query
      .sort({ 'product.createdAt': -1, ...sortCloseDateQuery })
      .exec();
  }

  async deleteMarketDataByLeaveSeller(sellerId: string) {
    try {
      return await this.marketModel.updateMany(
        {
          // 셀러가 등록했고 아직 삭제되지 않은 마켓데이터를 찾는다.
          seller: sellerId,
          deletedAt: null,
        },
        {
          // 유저탈퇴로 마켓에 등록한 데이터를 삭제한다.
          deletedAt: new Date(),
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
