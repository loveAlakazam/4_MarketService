# NoSQL(MongoDB)을 활용한 마켓 웹서비스

- 수행기간: 2022.11.07 ~ 2022.11.17
- 수행기간 이후에도 자발적으로 고도화 시킨 기능

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
