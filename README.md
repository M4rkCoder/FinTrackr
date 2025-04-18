# 📘 React 가계부 앱 설계내역서

## 1. 📌 프로젝트 개요

| 항목        | 내용                                    |
| ----------- | --------------------------------------- |
| 프로젝트명  | Fintrackr (또는 사용자 지정 이름)       |
| 개발 환경   | React + Vite + Supabase + Chart.js      |
| 주요 목적   | 수입/지출 관리 및 월간/일간 통계 시각화 |
| 플랫폼      | 웹 기반 (모바일 대응 포함)              |
| 대상 사용자 | 개인 또는 가정 단위 사용자              |

---

## 2. ⚙️ 기술 스택

| 항목       | 기술                                    |
| ---------- | --------------------------------------- |
| 프론트엔드 | React, Vite, Tailwind (선택), date-fns  |
| 상태관리   | useState, useEffect (or React Query 등) |
| 백엔드     | Supabase (PostgreSQL)                   |
| 시각화     | Chart.js or Recharts                    |
| 배포       | Netlify or Vercel                       |

---

## 3. 🧩 기능 목록

| 기능 구분   | 주요 기능        | 상세 설명                       |
| ----------- | ---------------- | ------------------------------- |
| 회원 관리   | 로그인/회원가입  | Supabase Auth 연동              |
| 가계부 입력 | 수입/지출 등록   | 날짜, 카테고리, 금액, 메모 입력 |
| 데이터 조회 | 월간 거래 리스트 | 선택한 월의 거래내역 출력       |
|             | 일간 상세 보기   | 날짜 클릭 시 상세 거래 표시     |
|             | 카테고리 필터    | 특정 항목만 필터링 가능         |
| 달력 연동   | 월간 캘린더      | `react-calendar` 사용           |
| 통계 분석   | 수입/지출 그래프 | 월별/일별 통계 시각화           |
| UX 기능     | 검색/필터링      | 키워드 검색 또는 날짜 필터      |
|             | 반응형 UI        | 모바일 대응 CSS 설계            |

---

## 4. 🧱 Supabase DB 구조

### 📁 테이블: `transactions`

| 필드명   | 타입      | 설명                    |
| -------- | --------- | ----------------------- |
| id       | uuid (PK) | 자동 생성               |
| user_id  | uuid      | Supabase Auth 사용자 ID |
| date     | date      | 거래 일자               |
| type     | string    | `income` 또는 `expense` |
| category | string    | 예: `식비`, `교통비` 등 |
| amount   | integer   | 금액                    |
| memo     | text      | 메모 (선택 항목)        |

> 참고: 월별 요약을 위한 View 테이블도 활용 가능 (예: `monthly_transaction`)

---

## 5. 🧮 화면별 UI 구성

| 화면            | 주요 요소                          | 설명                   |
| --------------- | ---------------------------------- | ---------------------- |
| 로그인/회원가입 | 이메일 인증, 자동 로그인           | Supabase Auth          |
| 대시보드        | 월간/연간 요약, 그래프             | Chart.js 사용          |
| 달력 화면       | 각 날짜에 수입/지출 요약 표시      | 날짜 클릭 시 상세 보기 |
| 거래 입력/조회  | 날짜 선택, 카테고리, 금액 입력     |                        |
| 자산 화면       | 자산 관리, 변동내역 조회/입력      |                        |
| 통계 화면       | 월간 차트, 카테고리 비율 분석      | Chart.js 사용          |
| 설정 화면       | 카테고리 관리, 고정지출 관리(반복) |                        |

---

## 6. 📦 컴포넌트 구조

<pre>
App
 ├── Navbar
 ├── Dashboard 
 │ ├── CalendarWithSummary 
 │ └── MonthlySummaryChart 
 ├── Transaction 
 │ ├── TransactionForm 
 │ └── TransactionList 
 ├── Statistics 
 │ ├── IncomeExpenseChart 
 │ └── CategoryPieChart 
 └── Auth 
    └── Login / Signup </pre>

## 7. 📆 개발 일정 (예시)

| 주차  | 작업 내용                                 |
| ----- | ----------------------------------------- |
| 1주차 | 프로젝트 구조 설정, Supabase 연동, 로그인 |
| 2주차 | 거래 입력 기능 개발                       |
| 3주차 | 달력 컴포넌트 연결 및 날짜별 조회         |
| 4주차 | 통계 시각화 페이지 구현                   |
| 5주차 | 모바일 대응 및 UI 마무리                  |
| 6주차 | 테스트 및 배포                            |

---

## ✅ 활용 팁

- 개발 중 체크리스트처럼 기능 하나씩 구현하며 ✅ 표시
- 협업 시 공유 문서로 활용
- 블로그/README 작성 시 베이스 문서로 사용
