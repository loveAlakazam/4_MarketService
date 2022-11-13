export const Err = {
  USER: {
    LOGIN_FAILED: {
      code: 401,
      message: '아이디와 비밀번호가 일치하지 않습니다.',
    },
    NOT_FOUND: {
      code: 404,
      message: '존재하지 않는 사용자 입니다.',
    },
    NOT_FOUND_SELLER: {
      code: 404,
      message: '존재하지 않는 셀러 입니다.',
    },
    EXIST_USER: {
      code: 400,
      message: '이미 존재하는 사용자 입니다.',
    },
    EXIST_SELLER: {
      code: 400,
      message: '이미 존재하는 셀러 입니다.',
    },
    DONT_ENROLL_SELLER_AGAIN: {
      code: 400,
      message: '이미 셀러로 등록했습니다.',
    },
  },
  PRODUCT: {
    NOT_ALLOW_WRITE_AUTH: {
      code: 401,
      message: '접근권한이 없습니다.',
    },
    NOT_FOUND: {
      code: 404,
      message: '존재하지 않는 상품 입니다.',
    },
    NOT_ALLOW_COUNTRY: {
      code: 400,
      message: '올바르지 않은 구매 국가 입니다.',
    },
    NOT_ALLOW_CATEGORY: {
      code: 400,
      message: '올바르지 않은 카테고리 입니다.',
    },
  },
  MARKET: {},
};
