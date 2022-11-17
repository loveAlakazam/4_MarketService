class SellerInfo {
  _id: string;
  sellerNickname: string;
}

class ProductInfo {
  _id: string;
  name: string;
  buyCountry: string;
  buyLocation: string;
  category: string;
  price: number;
  closeDate: string;
  createdAt: string;
  deletedAt: string;
}

export class MarketInfo {
  _id: string;
  product: ProductInfo;
  seller: SellerInfo;
}
