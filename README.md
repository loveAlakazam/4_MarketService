# NoSQL(MongoDB)을 활용한 마켓 웹서비스

- 수행기간: 2022.11.07 ~ 2022.11.17
- 수행기간 이후에도 자발적으로 고도화 시킨 기능
  - [고도화1. 유저탈퇴 기능 추가 ](https://github.com/loveAlakazam/4_MarketService/issues/15)
    - 유저가 탈퇴했을 때 User.deletedAt 값을 `null` -> `new Date()` 로 변경
    - 탈퇴할 유저가 셀러이고, 등록한 상품이 존재한다면, 해당상품의 deletedAt 값을 `null` -> `new Date()`로 변경
  - [고도화2. 셀러등록 계좌정보 컬럼추가](https://github.com/loveAlakazam/4_MarketService/issues/11)
  - 고도화3. Swagger 만들기

<br><br>

## 그동안 겪은 고민과 문제 해결과정 기록

- [나만의 Custom Error Exception 와 Custom Exception Filter 만들기 (feat: NestJS 다큐먼트 읽기)](https://ek12mv2.tistory.com/331)
- [서비스 로직에서 db를 호출하지 말고, Repository 레이어를 추가하기 ](https://ek12mv2.tistory.com/339)
- [NestJS framework에 MongoDB 연결하기](https://ek12mv2.tistory.com/333)
- [MongoDB+NestJS+Mongoose - 콜렉션의 외래키 컬럼 설정하는 방법](https://ek12mv2.tistory.com/336)
- [Guard가 있는 컨트롤러 유닛 테스트하기 - 유저 controller 테스트](https://ek12mv2.tistory.com/343)
- [Cast to date failed for value "[Function:now]" 에러 해결 - Soft Delete 구현하기](https://ek12mv2.tistory.com/344)
- [MongoDB populate() 사용해보기](https://ek12mv2.tistory.com/345)
- [MongoDB $cond, $exists, $nin, $gt 옵션들을 활용하여 쿼리문 만들기 : 판매자가 올린 다른 상품들 데이터 구하기 ](https://ek12mv2.tistory.com/347)
- [MongoDB aggregation 활용하여 마켓리스트 나타내기](https://ek12mv2.tistory.com/348)

<br><br>

## 사용기술스택

- Environment: <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

- Language: <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
- Framework: <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
- Database: <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">(MongoDB Atlas 5.0.13)
- Unit-Test: <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white">
- Etc
  - Mongoose
  - Github Action & Workflow

<br><br>

## ERD Diagram

- ERD Cloud
- 관계
  - 유저(셀러유저):상품 = 1:N
  - 유저:마켓 = 1:N
    - 셀러유저가 등록한 상품들을 마켓에도 등록합니다.
  - 마켓:상품 = 1:1

<img width="770" alt="crocket_erd_최종" src="https://user-images.githubusercontent.com/36457434/203004500-ad751ab1-a6bb-467a-91f8-4857e2e92fb0.png">

<br><br>

## 프로젝트 실행방법

> 패키지 설치

```bash
$ npm install
```

> 런타임 실행

```bash
$ npm run start
```

> Unit-Test 케이스 실행

```bash
$ npm run test
```

<br><br>

## API 명세서

### 1. 유저 API

|        URL         | Method |                                기능 설명                                 |
| :----------------: | :----: | :----------------------------------------------------------------------: |
| /api/auth/sign-up  |  POST  |                                 회원가입                                 |
| /api/auth/sign-in  |  POST  |                                  로그인                                  |
| /api/auth/sign-out |  GET   |                                 로그아웃                                 |
| /api/users/profile |  GET   |                          로그인한 유저정보 조회                          |
| /api/users/seller  | PATCH  | 일반유저에서 셀러유저로 전환 (isSeller 컬럼이 `false` -> `true` 로 변경) |
|   /api/users/:id   | DELETE |                                 회원탈퇴                                 |

<br>

### 2. 상품 API

- 상품은 셀러 유저만 등록이 가능합니다.

|        URL        | Method | 기능 설명           |
| :---------------: | :----: | ------------------- |
|   /api/products   |  POST  | 상품 등록           |
|   /api/products   |  GET   | 전상품 조회         |
| /api/products/:id |  GET   | 단일 상품 상세 조회 |
| /api/products/:id | PATCH  | 단일 상품 정보 수정 |
| /api/products/:id | DELETE | 단일 상품 삭제      |

<br>

### 3. 마켓 API

|      URL      | Method | 기능 설명                  |
| :-----------: | :----: | -------------------------- |
| /api/markets/ |  GET   | 마켓 조회 및 카테고리 검색 |

<br><br>

## API Platform Test (Insomnia)

<details>
<summary>유저 API</summary>

### 1. 회원가입

> 회원가입을 한 유저의 등급은 '일반' 등급으로 초기화합니다.
>
> 회원가입 완료하면 바로 로그인이 진행되지 않습니다.
>
> 셀러회원은 셀러등록 api를 요청해야합니다.

- URL : `localhost:3000/api/auth/sign-up`

- Request

```json
{
  "email": "giseok6@bankb.io",
  "password": "bank2Brothers@",
  "name": "이기석",
  "phoneNumber": "010-1666-2222"
}
```

- Response: 201 Created

<br>

> 이미 가입한 회원의 이메일(`busybe_3@bankb.io`)로 회원가입할 때는 400 Bad Request 에러를 리턴합니다.

- Request

```json
{
  "email": "busybe_3@bankb.io",
  "password": "bank11Brothers@",
  "name": "비지비1-4",
  "phoneNumber": "010-1666-2222"
}
```

- Response : 400 Bad Request

```json
{
  "statusCode": 400,
  "timestamp": "2022-11-21T12:17:31.551Z",
  "path": "/api/auth/sign-up",
  "message": {
    "code": 400,
    "message": "이미 존재하는 사용자 입니다."
  }
}
```

<br><br>

### 2. 로그인

- URL: `localhost:3000/api/auth/sign-in`

- Request

```json
{
  "email": "giseok4@bankb.io",
  "password": "bank2Brothers@"
}
```

- Response: 201 Created

<br>

### 3. 회원탈퇴

- 로그인 이후에 회원탈퇴 요청을 할 수 있습니다.
- 탈퇴처리가 완료되면, 탈퇴요청한 유저정보를 리턴합니다.

> 3-1. 일반유저 탈퇴

- URL: `localhost:3000/api/users/`

- Response: 200 OK

```json
{
  "deletedAt": null,
  "_id": "6370d5b98c9fb143211cc2a6",
  "name": "이기석",
  "email": "giseok4@bankb.io",
  "password": "$2b$10$l2dqFeN8X50S36uZV8psYO.UhaF57hKzxP6mx9rC0E5lzj4lcSjia",
  "phoneNumber": "010-1666-2222",
  "isSeller": false,
  "sellerNickname": null,
  "createdAt": "2022-11-13T11:32:09.958Z",
  "__v": 0
}
```

<br>

> 이후 다시 로그인을 요청하면 로그인이 불가합니다.

- URL: `localhost:3000/api/auth/sign-in`

- Request

```json
{
  "email": "giseok4@bankb.io",
  "password": "bank2Brothers@"
}
```

- Response: 400 Bad Request

```json
{
  "statusCode": 400,
  "timestamp": "2022-11-19T19:07:38.577Z",
  "path": "/api/auth/sign-in",
  "message": {
    "statusCode": 400,
    "message": "유저가 존재하지 않습니다.",
    "error": "Bad Request"
  }
}
```

<br><br>

### 4-1. 셀러등록 (ver.1)

> 일반유저로 로그인 이후에 셀러등록을 요청합니다.

- URL : `localhost:3000/api/users/seller`

- Request

```json
{
  "sellerNickname": "셀러 비지비4"
}
```

- Response : 200 OK

<br>

> 셀러유저로 로그인 이후에 요청하면 403 에러가 나옵니다.
> 비회원으로 셀려등록 api를 요청하면 403 에러가 나옵니다.

- Response : 403 Forbidden

```json
{
  "statusCode": 403,
  "timestamp": "2022-11-12T15:10:35.744Z",
  "path": "/api/users/seller",
  "message": {
    "statusCode": 403,
    "message": "Forbidden resource",
    "error": "Forbidden"
  }
}
```

<br>

### 4-2. 셀러등록 (ver.2)

> 셀러닉네임(sellerNickname), 예금주명(accountName), 은행명(accountBank), 계좌번호(accountNumber) 모두 필수로 입력해야됩니다.

- Request

```json
{
  "sellerNickname": "기스깅깅깅",
  "accountName": "이기석",
  "accountBank": "토스뱅크",
  "accountNumber": "1234-5678-5432"
}
```

- Response : 200 OK

<br>

### 5. 로그아웃

> 현재 로그인된 세션을 제거합니다.

- URL: `http://localhost:3000/api/auth/sign-out`
- Response : 200 OK

</details>

<br>

<details>
<summary>상품 API</summary>

### 1-1. 상품등록 1

- URL : `http://localhost:3000/api/products`

- Request

```json
{
  "name": "상품등록테스트",
  "category": "식품",
  "price": 5500,
  "closeDate": "2022-12-15",
  "description": "상품등록 테스트데이터",
  "buyCountry": "대한민국"
}
```

- Response : 201 Created

```json
{
  "user": "637113524a01e69f6ddf2201",
  "name": "상품등록테스트",
  "buyCountry": "대한민국",
  "buyLocation": null,
  "category": "식품",
  "price": 5500,
  "description": "상품등록 테스트데이터",
  "closeDate": "2022-12-15T00:00:00.000Z",
  "createdAt": "2022-11-13T16:47:42.121Z",
  "deletedAt": null,
  "_id": "6371207d921da6e270b655e7",
  "__v": 0
}
```

<br>

### 1-2. 상품등록 2

- Request

```json
{
  "name": "초코칩 쿠키",
  "category": "식품",
  "price": 3500,
  "description": "상품등록 테스트데이터",
  "buyCountry": "대한민국",
  "buyLocation": "대구",
  "closeDate": "2022-12-31"
}
```

- Response : 201 Created

```json
{
  "user": "636b835c84d6972931416310",
  "name": "초코칩 쿠키",
  "buyCountry": "대한민국",
  "buyLocation": "대구",
  "category": "식품",
  "price": 3500,
  "description": "상품등록 테스트데이터",
  "closeDate": "2022-12-31T00:00:00.000Z",
  "createdAt": "2022-11-19T16:21:28.605Z",
  "deletedAt": null,
  "_id": "637902c3053344cbeff20f6a",
  "__v": 0
}
```

<br>

### 2. 상품수정

- URL : `localhost:3000/api/products/637113fe4a01e69f6ddf220a`

- Request

```json
{
  "buyCountry": "대한민국",
  "buyLocation": "대구",
  "name": "로제떡볶이",
  "description": "기스깅 테스트 상품수정 테스트",
  "closeDate": null
}
```

- Response : 200 OK

<br><br>

### 3. 상품삭제

- URL : `localhost:3000/api/products/6371207d921da6e270b655e7`

- Response : 200 OK

<br><br>

### 4-1. 상품 상세조회

- URL : `http://localhost:3000/api/products/63711974edd439858c0801c1`

- Response

  - 필드 설명
    - info: 조회하려는 상품 정보: 상품 id 가 `63711974edd439858c0801c1`인 상품 정보
    - seller: 현재 상품을 등록한 셀러정보
    - others: 셀러가 등록한 다른 상품정보

```json
{
  "info": {
    "_id": "63711974edd439858c0801c1",
    "name": "떡볶이",
    "buyCountry": "대한민국",
    "buyLocation": null,
    "category": "식품",
    "price": 3500,
    "description": "상품등록 테스트데이터",
    "closeDate": null,
    "createdAt": "2022-11-13T16:20:15.946Z"
  },
  "seller": {
    "_id": "637113524a01e69f6ddf2201",
    "name": "이기석",
    "email": "giseok6@bankb.io",
    "phoneNumber": "010-1666-2222",
    "isSeller": true,
    "sellerNickname": "셀러 이기석"
  },
  "others": [
    {
      "_id": "637113fe4a01e69f6ddf220a",
      "user": "637113524a01e69f6ddf2201",
      "name": "로제떡볶이",
      "buyCountry": "대한민국",
      "buyLocation": "대구",
      "category": "식품",
      "price": 3500,
      "description": "기스깅 테스트 상품수정 테스트",
      "closeDate": null,
      "createdAt": "2022-11-13T15:54:53.828Z",
      "deletedAt": null,
      "__v": 0
    }
  ]
}
```

<br>

### 4-2. 상품 상세정보 조회 (ver.2)

> 셀러 등록 고도화 이후 - 셀러의 정보(seller)에 셀러의 계좌정보(은행/예금주명/계좌번호) 도 추가
>
> > seller.accountName, seller.accountBank, seller.accountNumber 추가완료

- URL: `localhost:3000/api/products/637b7ee2be3f07450d7c752d`

- Response

```json
{
  "info": {
    "_id": "637b7ee2be3f07450d7c752d",
    "name": "마시멜로우 쿠키",
    "buyCountry": "대한민국",
    "buyLocation": "대구",
    "category": "식품",
    "price": 3500,
    "description": "상품등록 테스트데이터",
    "closeDate": "2022-12-31T00:00:00.000Z",
    "createdAt": "2022-11-21T13:35:18.270Z"
  },
  "seller": {
    "_id": "6370afcd636b64745342113c",
    "name": "이기석3",
    "email": "giseok3@bankb.io",
    "phoneNumber": "010-1666-2222",
    "isSeller": true,
    "sellerNickname": "기스깅깅깅",
    "accountName": "이기석",
    "accountBank": "토스뱅크",
    "accountNumber": "1234-5678-5432"
  },
  "others": [
    {
      "_id": "637b7ed4be3f07450d7c7528",
      "user": "6370afcd636b64745342113c",
      "name": "오레오 쿠키",
      "buyCountry": "대한민국",
      "buyLocation": "대구",
      "category": "식품",
      "price": 3500,
      "description": "상품등록 테스트데이터",
      "closeDate": "2022-12-31T00:00:00.000Z",
      "createdAt": "2022-11-21T13:35:18.270Z",
      "deletedAt": null,
      "__v": 0
    }
  ]
}
```

<br><br>

### 5. 전체 상품조회

- URL : `http://localhost:3000/api/products`

- Response

```json
[
  {
    "info": {
      "_id": "6370b031271d61db9e798969",
      "name": "black padding",
      "buyCountry": "이탈리아",
      "buyLocation": null,
      "category": "의류",
      "price": 155000,
      "description": "테스트데이터 저희 뱅크투브라더스가 입고 배틀했던 블랙패딩을 판매합니다!",
      "closeDate": "2022-12-01T00:00:00.000Z",
      "createdAt": "2022-11-13T08:52:01.003Z"
    },
    "seller": {
      "_id": "636b85f635551795415e29fc",
      "name": "제이락",
      "email": "jayrak@gmail.com",
      "phoneNumber": "010-1132-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370b1de385da56594cde414",
      "name": "black padding",
      "buyCountry": "이탈리아",
      "buyLocation": null,
      "category": "의류",
      "price": 155000,
      "description": "테스트데이터 저희 뱅크투브라더스가 입고 배틀했던 블랙패딩을 판매합니다!",
      "closeDate": "2022-12-01T00:00:00.000Z",
      "createdAt": "2022-11-13T08:59:10.813Z"
    },
    "seller": {
      "_id": "636b85f635551795415e29fc",
      "name": "제이락",
      "email": "jayrak@gmail.com",
      "phoneNumber": "010-1132-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370b3a6dfdde3be63cb2916",
      "name": "black padding",
      "buyCountry": "이탈리아",
      "buyLocation": null,
      "category": "의류",
      "price": 155000,
      "description": "테스트데이터 저희 뱅크투브라더스가 입고 배틀했던 블랙패딩을 판매합니다!",
      "closeDate": "2022-12-11T00:00:00.000Z",
      "createdAt": "2022-11-13T09:06:46.932Z"
    },
    "seller": {
      "_id": "636b835c84d6972931416310",
      "name": "기스깅",
      "email": "hello2@gmail.com",
      "phoneNumber": "010-1111-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370b3b8dfdde3be63cb291b",
      "name": "black padding",
      "buyCountry": "이탈리아",
      "buyLocation": null,
      "category": "의류",
      "price": 155000,
      "description": "테스트데이터 저희 뱅크투브라더스가 입고 배틀했던 블랙패딩을 판매합니다!",
      "closeDate": "2022-12-31T00:00:00.000Z",
      "createdAt": "2022-11-13T09:07:04.777Z"
    },
    "seller": {
      "_id": "636b835c84d6972931416310",
      "name": "기스깅",
      "email": "hello2@gmail.com",
      "phoneNumber": "010-1111-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370b3f0dfdde3be63cb2921",
      "name": "black padding",
      "buyCountry": "대한민국",
      "buyLocation": "서울",
      "category": "의류",
      "price": 75000,
      "description": "셀러 상품수정 테스트",
      "closeDate": null,
      "createdAt": "2022-11-13T09:08:00.918Z"
    },
    "seller": {
      "_id": "636b85f635551795415e29fc",
      "name": "제이락",
      "email": "jayrak@gmail.com",
      "phoneNumber": "010-1132-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370cc9c14c18963012915c4",
      "name": "무지개 스웨터",
      "buyCountry": "지역상관없음",
      "buyLocation": null,
      "category": "의류",
      "price": 15000,
      "description": "테스트데이터",
      "closeDate": null,
      "createdAt": "2022-11-13T10:53:16.704Z"
    },
    "seller": {
      "_id": "636b85f635551795415e29fc",
      "name": "제이락",
      "email": "jayrak@gmail.com",
      "phoneNumber": "010-1132-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6370cfca01bc3ccc74f12d24",
      "name": "상품등록테스트",
      "buyCountry": "대한민국",
      "buyLocation": null,
      "category": "식품",
      "price": 5500,
      "description": "상품등록 테스트데이터",
      "closeDate": "2022-12-15T00:00:00.000Z",
      "createdAt": "2022-11-13T11:06:50.129Z"
    },
    "seller": {
      "_id": "636b8e4e22a0a3e2c177cb16",
      "name": "비지비2",
      "email": "busybe2@gmail.com",
      "phoneNumber": "010-1133-2222",
      "isSeller": true,
      "sellerNickname": null
    }
  },
  {
    "info": {
      "_id": "6371100a3446abd106429328",
      "name": "무지개 스웨터",
      "buyCountry": "지역상관없음",
      "buyLocation": null,
      "category": "의류",
      "price": 15000,
      "description": "테스트데이터",
      "closeDate": null,
      "createdAt": "2022-11-13T15:40:48.903Z"
    },
    "seller": {
      "_id": "6370d8757e885a82cf8df8d0",
      "name": "비지비1-2",
      "email": "busybe_2@bankb.io",
      "phoneNumber": "010-1666-2222",
      "isSeller": true,
      "sellerNickname": "셀러_비지비1"
    }
  },
  {
    "info": {
      "_id": "637113fe4a01e69f6ddf220a",
      "name": "로제떡볶이",
      "buyCountry": "대한민국",
      "buyLocation": "대구",
      "category": "식품",
      "price": 3500,
      "description": "기스깅 테스트 상품수정 테스트",
      "closeDate": null,
      "createdAt": "2022-11-13T15:54:53.828Z"
    },
    "seller": {
      "_id": "637113524a01e69f6ddf2201",
      "name": "이기석",
      "email": "giseok6@bankb.io",
      "phoneNumber": "010-1666-2222",
      "isSeller": true,
      "sellerNickname": "셀러 이기석"
    }
  },
  {
    "info": {
      "_id": "63711974edd439858c0801c1",
      "name": "떡볶이",
      "buyCountry": "대한민국",
      "buyLocation": null,
      "category": "식품",
      "price": 3500,
      "description": "상품등록 테스트데이터",
      "closeDate": null,
      "createdAt": "2022-11-13T16:20:15.946Z"
    },
    "seller": {
      "_id": "637113524a01e69f6ddf2201",
      "name": "이기석",
      "email": "giseok6@bankb.io",
      "phoneNumber": "010-1666-2222",
      "isSeller": true,
      "sellerNickname": "셀러 이기석"
    }
  }
]
```

</details>

<br>

<details>
<summary>마켓 API</summary>

### 1. 마켓조회

- URL : `http://localhost:3000/api/markets?page=1&name=black`

- Response

```json
[
  {
    "_id": "6370b3f0dfdde3be63cb2923",
    "seller": [
      {
        "_id": "636b85f635551795415e29fc",
        "name": "제이락"
      }
    ],
    "product": [
      {
        "_id": "6370b3f0dfdde3be63cb2921",
        "user": "636b85f635551795415e29fc",
        "name": "black padding",
        "buyCountry": "대한민국",
        "category": "의류",
        "price": 75000,
        "description": "셀러 상품수정 테스트",
        "closeDate": null,
        "createdAt": "2022-11-13T09:08:00.918Z",
        "__v": 0,
        "buyLocation": "서울"
      }
    ]
  },
  {
    "_id": "6370b1f5385da56594cde416",
    "seller": [
      {
        "_id": "636b85f635551795415e29fc",
        "name": "제이락"
      }
    ],
    "product": [
      {
        "_id": "6370b1de385da56594cde414",
        "user": "636b85f635551795415e29fc",
        "name": "black padding",
        "buyCountry": "이탈리아",
        "category": "의류",
        "price": 155000,
        "description": "테스트데이터 저희 뱅크투브라더스가 입고 배틀했던 블랙패딩을 판매합니다!",
        "closeDate": "2022-12-01T00:00:00.000Z",
        "createdAt": "2022-11-13T08:59:10.813Z",
        "__v": 0
      }
    ]
  }
]
```

<br>

</details>
