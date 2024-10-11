# 소셜 미디어 통합 Feed 서비스

## Table of Contents

- [개요](#개요)
- [기술 스택](#기술-스택)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [API 명세서](#api-명세서)
- [프로젝트 관리](#프로젝트-관리)
- [구현과정(설계 및 의도)](#구현과정설계-및-의도)
- [TIL 및 회고](#til-및-회고)
- [디렉토리 구조](#디렉토리-구조)
- [Author](#author)

<br/>

## 개요

유저 계정의 해시태그를 기반으로 여러 SNS에 게시된 게시물 중
유저의 해시태그가 포함된 게시물들을 하나의 서비스에서 확인할 수 있는 **통합 Feed 서비스**의 API 서버입니다.
유저는 하나의 채널에서 유저(`#dani`), 또는 브랜드(`#danish op`) 의 SNS 노출 게시물 및 통계를 확인할 수 있습니다.

- 유저는 계정(추후 해시태그로 관리), 비밀번호, 이메일로 **가입요청**을 진행합니다.
- 가입 요청 시, 이메일로 발송된 코드를 입력하여 **가입승인**을 받고 서비스 이용이 가능합니다.
- 서비스 로그인 후, **통합 Feed** 메뉴를 통해 서비스를 이용할 수 있습니다.
- 통합 Feed 에선 `인스타그램`, `스레드`, `페이스북`, `트위터` 에서 유저의 계정이 태그된 글들을 확인합니다.
- 또는, 특정 해시태그(1건)를 입력하여, 해당 해시태그가 포함된 게시물들을 확인합니다.
- 유저는 본인 계정명 또는 특정 해시태그 일자별, 시간별 게시물 갯수 통계를 확인할 수 있습니다.

<br/>

## 기술 스택

|                 | Stack                                                                                                                                                                                                                                                                                                               | Version                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Runtime**     | <img src="https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white" />                                                                                                                                                                                                          | v20.x.x                       |
| **Language**    | <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white" />                                                                                                                                                                                                    | v5.1.x                        |
| **Framework**   | <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />                                                                                                                                                                                                            | v10.x.x                       |
| **Database**    | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/typeorm-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" />                                                                                                   | MySQL v8.0.x, TypeORM v0.3.x |
| **Environment** | <img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"> <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white" />                                                                                                          | npm v10.2.x                   |
| **etc**         | <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"> <img src="https://img.shields.io/badge/passport-34E27A?style=for-the-badge&logo=passport&logoColor=white"> <img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white"> | N/A                           |

## Installation

```bash
npm install
```

<br/>

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

<br/>

## API 명세서

| 도메인     | 기능명                 | HTTP Method | URL                      | 인증 | 담당자 |
| ---------- | ---------------------- | ----------- | ------------------------ | ---- | ------ |
| User       | 회원 가입              | POST        | /api/uses/sign-up        | X    | 김도연 |
| User       | 로그인                 | POST        | /api/users/sign-in       | X    | 김도연 |
| User       | 사용자 가입 승인       | PATCH       | /api/users/verify-email  | O    | 김도연 |
| Posting    | 게시물 목록 조회       | GET         | /api/postings            | O    | 오다은 |
| Posting    | 게시물 상세 조회       | GET         | /api/postings/{id}       | O    | 오다은 |
| Posting    | 게시물 좋아요          | PATCH       | /api/postings/{id}/like  | O    | 주소미 |
| Posting    | 게시물 공유하기        | PATCH       | /api/postings/{id}/share | O    | 주소미 |
| Statistics | 해시태그별 게시물 통계 | GET         | /api/statistics          | O    | 김지수 |

#### API 상세 문서

API에 대한 자세한 정보와 명세는 아래 링크를 통해 확인할 수 있습니다. 각 엔드포인트에 대한 설명과 예시가 포함되어 있습니다.

[![Notion](https://img.shields.io/badge/API_상세_문서-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://evening-cushion-319.notion.site/0e3a0e0928b64f0aa0f33bd2c5c35fef?v=6833b9f9a2694e7898a0cf05b37d08d0&pvs=25)

## 프로젝트 관리

#### 프로젝트 팀 노션 링크

[![Notion](https://img.shields.io/badge/Project_Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://evening-cushion-319.notion.site/social-feed-hub-3d5b2f6431a94056af5576decb074f74)

#### 팀 규칙 &코드 컨벤션

코드의 일관성을 유지하기 위해 특정 코드 컨벤션과 팀 규칙을 따르고 있습니다.
자세한 내용은 아래 노션 링크를 통해 확인할 수 있습니다.

[![Notion](https://img.shields.io/badge/코드_컨벤션_및_팀_규칙-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://evening-cushion-319.notion.site/9e36314df92e468b8285abd6b57217e8?pvs=25)

<details>
  <summary><h4>커밋 메시지 컨벤션</h4></summary>

    # (gitmoji) <타입> : <제목><이슈번호>

    ##### 제목은 이슈 번호와 함께 최대 50 글자까지 한 줄로 입력 ############## -> |

    # 본문은 위에 작성
    ######## 본문은 한 줄에 최대 72 글자까지만 입력 ########################### -> |

    # --- COMMIT END ---
    # <타입> 리스트
    #   ✨(:sparkles:) feat    : 기능 (새로운 기능)
    #   🐛(:bug:) fix     : 버그 (버그 수정)
    #   ♻(:recycle:) refactor : 리팩토링
    #   💄(:lipstick:) style   : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
    #   📝(:memo:) docs    : 문서 (문서 추가, 수정, 삭제)
    #   ✅(:white_check_mark:) test    : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
    #   🔨(:hammer:) chore   : 기타 변경사항 (빌드 스크립트 수정 등)
    # ------------------
    #     제목은 명령문으로
    #     제목 끝에 마침표(.) 금지
    #     제목과 본문을 한 줄 띄워 분리하기
    #     본문은 "어떻게" 보다 "무엇을", "왜"를 설명한다.
    #     본문은 한 줄을 작성하고 . 마침표를 찍어서 분리한다.
    # ------------------

</details>

<details>
  <summary><h4>브랜치 전략</h4></summary>

| 브랜치 유형        | 브랜치 이름 | 설명                                                                         | 사용법                                                                       |
| ------------------ | ----------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Main Branch**    | `main`      | 제품으로 출시될 수 있는 브랜치                                               | 사용자에게 배포 가능한 상태만을 관리하며, 배포(release) 이력을 관리합니다.   |
| **Develop Branch** | `dev`       | 다음 출시 버전을 개발하는 브랜치                                             | 모든 기능이 추가되고 버그가 수정된 후, `dev` 브랜치를 `main`으로 병합합니다. |
| **Feature Branch** | `feature/*` | 새로운 기능 개발 및 버그 수정이 필요할 때마다 `dev` 브랜치로부터 분기됩니다. | 개발이 완료되면 `dev` 브랜치로 merge 하여 다른 사람들과 공유합니다.          |

### 예시

- Feature 브랜치 명명 규칙: `feature/기능요약` (예: `feature/login-api`)

</details>

<br/>

## 구현과정(설계 및 의도)

## TIL 및 회고

<br/>

## 디렉토리 구조

<details>
  <summary>프로젝트 디렉토리 구조</summary>
  
```
├── README.md
├── database
│   ├── data-source.ts
│   ├── factory
│   │   ├── base-model.factory.ts
│   │   ├── hashtag.factory.ts
│   │   ├── posting.factory.ts
│   │   └── user.factory.ts
│   └── seeds
│       └── seeder.ts
├── dist
│   ├── app.controller.d.ts
│   ├── app.controller.js
│   ├── app.controller.js.map
│   ├── app.module.d.ts
│   ├── app.module.js
│   ├── app.module.js.map
│   ├── app.service.d.ts
│   ├── app.service.js
│   ├── app.service.js.map
│   ├── entities
│   │   ├── base-model.entity.d.ts
│   │   ├── base-model.entity.js
│   │   ├── base-model.entity.js.map
│   │   ├── hashtag.entity.d.ts
│   │   ├── hashtag.entity.js
│   │   ├── hashtag.entity.js.map
│   │   ├── posting-hashtag.entity.d.ts
│   │   ├── posting-hashtag.entity.js
│   │   ├── posting-hashtag.entity.js.map
│   │   ├── posting.entity.d.ts
│   │   ├── posting.entity.js
│   │   ├── posting.entity.js.map
│   │   ├── user.entity.d.ts
│   │   ├── user.entity.js
│   │   └── user.entity.js.map
│   ├── main.d.ts
│   ├── main.js
│   ├── main.js.map
│   ├── postings
│   │   ├── postings.controller.d.ts
│   │   ├── postings.controller.js
│   │   ├── postings.controller.js.map
│   │   ├── postings.module.d.ts
│   │   ├── postings.module.js
│   │   ├── postings.module.js.map
│   │   ├── postings.service.d.ts
│   │   ├── postings.service.js
│   │   └── postings.service.js.map
│   └── tsconfig.build.tsbuildinfo
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.constants.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── decorator
│   │   └── is-public.decorator.ts
│   ├── entities
│   │   ├── base-model.entity.ts
│   │   ├── hashtag.entity.ts
│   │   ├── posting-hashtag.entity.ts
│   │   ├── posting.entity.ts
│   │   └── user.entity.ts
│   ├── main.ts
│   ├── postings
│   │   ├── postings.controller.spec.ts
│   │   ├── postings.controller.ts
│   │   ├── postings.module.ts
│   │   ├── postings.service.spec.ts
│   │   └── postings.service.ts
│   ├── statistics
│   │   ├── dto
│   │   │   ├── statistic-query.dto.ts
│   │   │   └── statistic-response.dto.ts
│   │   ├── statistics.controller.spec.ts
│   │   ├── statistics.controller.ts
│   │   ├── statistics.module.ts
│   │   ├── statistics.service.spec.ts
│   │   ├── statistics.service.ts
│   │   └── types
│   │       └── statistics.constants.ts
│   └── users
│       ├── dto
│       │   ├── create-user.dto.ts
│       │   ├── user-request.dto.ts
│       │   └── user-response.dto.ts
│       ├── users.constants.ts
│       ├── users.controller.spec.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts
│       └── users.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json

18 directories, 88 files

```
</details>
<br/>



## Author

| <img src="https://avatars.githubusercontent.com/kimdoyeonn?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/jis-kim?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/ooheunda?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/joosomi?v=4" width="150" height="150"/> |
| :----------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|                김도연<br/>[@kimdoyeonn](https://github.com/kimdoyeonn)                     |                김지수<br/>[@jis-kim](https://github.com/jis-kim)                       |                오다은<br/>[@ooheunda](https://github.com/ooheunda)                     |               주소미<br/>[@joosomi](https://github.com/joosomi)                       |
|          회원 가입<br/> 로그인 <br/> 사용자 가입 승인                                       |                해시태그별 게시물 통계                                                  |                게시물 목록 조회<br/> 게시물 상세 조회                                  |               게시물 좋아요<br/> 게시물 공유하기                                       |
```
