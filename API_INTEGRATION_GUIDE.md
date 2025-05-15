# HwanBee 은행 API 연동 가이드

이 문서는 HwanBee 은행 프론트엔드 애플리케이션과 백엔드 API를 연동하는 방법을 설명합니다.

## 현재 데이터 상태

현재 애플리케이션은 로컬 스토리지에 저장된 더미 데이터를 사용하고 있습니다:

1. **인증 데이터**: 사용자 정보, 인증 토큰, 리프레시 토큰
2. **계좌 데이터**: 사용자의 계좌 목록
3. **거래 내역 데이터**: 모든 거래 내역
4. **환율 데이터**: 다양한 통화의 환율 정보

## API 연동 방법

### 1. 환경 변수 설정

백엔드 API 서버 URL을 환경 변수로 설정합니다:

\`\`\`env
NEXT_PUBLIC_API_URL=https://api.hwanbee-bank.com
\`\`\`

### 2. API 클라이언트 활성화

`lib/api.ts` 파일에 정의된 API 클라이언트를 사용합니다. 이 파일은 다음을 포함합니다:

- Axios 인스턴스 설정
- 인증 토큰 인터셉터
- 토큰 갱신 로직
- API 엔드포인트 정의

### 3. 컨텍스트 파일 수정

다음 파일에서 주석 처리된 API 호출 코드의 주석을 해제하고, 로컬 스토리지 기반 코드를 주석 처리합니다:

1. `context/auth-context.tsx`: 인증 관련 API 호출
2. `context/bank-data-context.tsx`: 계좌 및 거래 관련 API 호출

### 4. 더미 데이터 제거

`context/bank-data-context.tsx` 파일에서 `SAMPLE_ACCOUNTS`와 `SAMPLE_TRANSACTIONS` 배열을 제거합니다.

## API 엔드포인트 및 동작 방식

### 인증 API

1. **로그인**
   - 엔드포인트: `POST /auth/login`
   - 요청: `{ email: string, password: string }`
   - 응답: `{ accessToken: string, refreshToken: string, user: User }`
   - 동작: 사용자 인증 후 토큰 발급

2. **회원가입**
   - 엔드포인트: `POST /auth/signup`
   - 요청: `{ email: string, password: string, name: string, phoneNumber: string, address?: string }`
   - 응답: `{ accessToken: string, refreshToken: string, user: User }`
   - 동작: 새 사용자 등록 및 토큰 발급

3. **토큰 갱신**
   - 엔드포인트: `POST /auth/refresh`
   - 요청: `{ refreshToken: string }`
   - 응답: `{ accessToken: string }`
   - 동작: 리프레시 토큰으로 새 액세스 토큰 발급

4. **로그아웃**
   - 엔드포인트: `POST /auth/logout`
   - 요청: `{}`
   - 응답: `{ success: boolean }`
   - 동작: 서버에서 토큰 무효화

5. **OAuth 콜백**
   - 엔드포인트: `POST /auth/oauth/callback`
   - 요청: `{ code: string, state?: string }`
   - 응답: `{ accessToken: string, refreshToken: string, user: User }`
   - 동작: OAuth 인증 코드로 토큰 발급

### 사용자 API

1. **프로필 조회**
   - 엔드포인트: `GET /users/profile`
   - 응답: `User`
   - 동작: 현재 인증된 사용자의 프로필 정보 조회

2. **프로필 업데이트**
   - 엔드포인트: `PUT /users/profile`
   - 요청: `Partial<User>`
   - 응답: `User`
   - 동작: 사용자 프로필 정보 업데이트

3. **비밀번호 변경**
   - 엔드포인트: `PUT /users/password`
   - 요청: `{ currentPassword: string, newPassword: string }`
   - 응답: `{ success: boolean }`
   - 동작: 사용자 비밀번호 변경

### 계좌 API

1. **계좌 목록 조회**
   - 엔드포인트: `GET /accounts`
   - 응답: `Account[]`
   - 동작: 사용자의 모든 계좌 목록 조회

2. **계좌 상세 조회**
   - 엔드포인트: `GET /accounts/:id`
   - 응답: `Account`
   - 동작: 특정 계좌의 상세 정보 조회

3. **계좌 생성**
   - 엔드포인트: `POST /accounts`
   - 요청: `{ accountNumber: string, accountName: string, balance: number, currency: string, type: string }`
   - 응답: `Account`
   - 동작: 새 계좌 생성

4. **계좌 삭제**
   - 엔드포인트: `DELETE /accounts/:id`
   - 응답: `{ success: boolean }`
   - 동작: 특정 계좌 삭제

### 거래 API

1. **거래 내역 조회**
   - 엔드포인트: `GET /transactions`
   - 응답: `Transaction[]`
   - 동작: 모든 거래 내역 조회

2. **계좌별 거래 내역 조회**
   - 엔드포인트: `GET /transactions/account/:accountId`
   - 응답: `Transaction[]`
   - 동작: 특정 계좌의 거래 내역 조회

3. **거래 상세 조회**
   - 엔드포인트: `GET /transactions/:id`
   - 응답: `Transaction`
   - 동작: 특정 거래의 상세 정보 조회

4. **송금**
   - 엔드포인트: `POST /transactions/transfer`
   - 요청: `{ fromAccountId: string, toAccountNumber: string, amount: number, description: string }`
   - 응답: `Transaction`
   - 동작: 계좌 간 송금 처리

5. **환전**
   - 엔드포인트: `POST /transactions/exchange`
   - 요청: `{ fromAccountId: string, toCurrency: string, amount: number }`
   - 응답: `Transaction`
   - 동작: 통화 환전 처리

### 환율 API

1. **환율 조회**
   - 엔드포인트: `GET /exchange/rates`
   - 응답: `ExchangeRate[]`
   - 동작: 현재 환율 정보 조회

## 데이터 모델

### User

\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  address?: string;
}
\`\`\`

### Account

\`\`\`typescript
interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  type: AccountType;
  createdAt: string;
}

enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  DEPOSIT = "DEPOSIT",
}
\`\`\`

### Transaction

\`\`\`typescript
interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  recipientName?: string;
  recipientAccount?: string;
  date: string;
  status: TransactionStatus;
  processingTime?: string;
  senderName?: string;
  senderAccount?: string;
  exchangeRate?: number;
  exchangedAmount?: number;
  fee?: number;
}

enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  EXCHANGE = "EXCHANGE",
}

enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}
\`\`\`

### ExchangeRate

\`\`\`typescript
interface ExchangeRate {
  currency: string;
  rate: number;
  name: string;
  flag: string;
}
\`\`\`

## 에러 처리

API 호출 시 발생할 수 있는 에러를 처리하는 방법:

1. **인증 오류 (401)**: 토큰 갱신 시도 후 실패 시 로그아웃 처리
2. **권한 오류 (403)**: 접근 권한 없음 메시지 표시
3. **리소스 없음 (404)**: 해당 리소스가 없음 메시지 표시
4. **서버 오류 (500)**: 서버 오류 메시지 표시

## 보안 고려사항

1. **토큰 저장**: 액세스 토큰과 리프레시 토큰은 로컬 스토리지에 저장
2. **토큰 갱신**: 액세스 토큰 만료 시 리프레시 토큰으로 자동 갱신
3. **HTTPS**: 모든 API 통신은 HTTPS를 통해 이루어짐
4. **CSRF 보호**: 필요한 경우 CSRF 토큰 사용

## 마이그레이션 체크리스트

1. 환경 변수 설정 (`NEXT_PUBLIC_API_URL`)
2. `lib/api.ts` 파일의 API 클라이언트 설정 확인
3. `context/auth-context.tsx` 파일의 API 호출 코드 주석 해제
4. `context/bank-data-context.tsx` 파일의 API 호출 코드 주석 해제
5. 더미 데이터 제거
6. 테스트 및 디버깅
