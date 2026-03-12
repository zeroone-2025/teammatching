# TeamMaker
https://teammatching.vercel.app/

> 개발자와 비개발자의 역할을 자동으로 배분해 균형 잡힌 팀을 구성해주는 스마트 팀 빌딩 도구

## 프로젝트 소개

| 항목 | 내용 |
|------|------|
| **Pain Point** | 수동 배치의 비효율, 각 사람의 역량이 맞게 배정되지 않는 문제 |
| **주요 타겟** | 제로톤 활동 참여자 |
| **확장 계획** | 제로톤 → 친바 → 기업 내부 프로젝트 팀 빌딩 |

## 핵심 기능

- 개발자 / 비개발자 구분 입력 (비개발자는 기획·마케팅 역할만 선택 가능)
- 팀 수 입력 시 자동 균등 배분 (나머지 인원은 일부 팀에 1명씩 추가 배정)
- 팀원 삭제 및 다시 섞기
- 팀 구성 결과 카드 화면

## 발표 자료

- PPT 다운로드 링크: [ZEROTIME_TeamMaker.pdf](https://drive.google.com/file/d/1hw67Zo9zHF5kvCicuR7NTc42zY8omoTR/view?usp=drive_link)
- 포스터: 

![팀메이커 포스터](docs/poster.png)

## 개발 개요

| 항목 | 내용 |
|------|------|
| **프레임워크** | Next.js 15 (App Router) |
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS |
| **상태 관리** | Zustand |
| **배포** | Vercel |

---

# 🚀 제로톤 스타터 킷

> Zero에서 One을 만드는 2시간의 경험

매주 수요일 2시간 미니 해커톤 **"제로톤(Zero-Thon)"** 을 위한 스타터 킷 템플릿입니다.
GitHub의 "Use this template" 버튼으로 새 레포를 생성하면, 즉시 기능 개발에 착수할 수 있습니다.

## 역할별 시작 가이드

| 역할 | 시작 파일 | 설명 |
|------|-----------|------|
| 🎯 **기획자** | `docs/plan.md` · `docs/ppt.md` | 아이디어 구체화 + 발표 준비 |
| 💻 **개발자** | `docs/dev.md` · `frontend/src/` | 개발 문서 작성 후 코딩 시작 |
| 📢 **마케터** | `docs/marketing.md` | 사용자에게 다가가세요 |

## 문서 작성 가이드

`docs/` 폴더의 각 문서는 마크다운(.md) 형식의 템플릿입니다.
`[ ]` 체크박스, 테이블, 가이드 질문을 따라 작성하면 됩니다.

- **plan.md**: 프로젝트 개요, 타겟, MVP 범위, 타임라인 (기획자)
- **dev.md**: 기술 스택, 화면 구성, API 설계, AI 프롬프트 기록 (개발자)
- **marketing.md**: 페르소나, 카피라이팅, 유입 전략 (마케터)
- **ppt.md**: 4분 발표 스크립트 — Pain → Solution → Demo → Scalability (기획자)

## 시작하기

### 1. 템플릿으로 내 레포 생성
이 레포 상단의 **"Use this template"** → **"Create a new repository"** 클릭하여 내 레포를 만드세요.
- **Owner**: `zeroone-2025`로 설정
- **Repository name**: 팀 프로젝트명으로 지어주세요

### 2. 클론 & 의존성 설치
```bash
git clone https://github.com/zeroone-2025/<내-레포명>.git
cd <내-레포명>/frontend
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
[http://localhost:3000](http://localhost:3000)에서 정상 동작을 확인하세요.

### 4. 초기 파일 삭제 후 개발 시작
`src/app/page.tsx`를 삭제하고 개발을 시작하세요.

## 기술 스택

| 기술 | 용도 |
|------|------|
| **Next.js 15** | App Router 기반 풀스택 프레임워크 |
| **React 19** | UI 라이브러리 |
| **TypeScript** | 타입 안전성 |
| **Tailwind CSS** | 유틸리티 퍼스트 스타일링 |
| **shadcn/ui** | 재사용 가능한 UI 컴포넌트 |
| **React Query** | 서버 상태 관리 |
| **Zustand** | 클라이언트 상태 관리 |
| **Lucide Icons** | 아이콘 라이브러리 |

## 폴더 구조

```
zerothon-template/
├── frontend/          # Next.js 프로젝트 (개발자 영역)
│   └── src/
│       ├── app/       # 페이지 & API 라우트
│       ├── components/# UI 컴포넌트
│       ├── hooks/     # 커스텀 훅
│       ├── lib/       # 유틸리티
│       ├── providers/ # Provider 컴포넌트
│       └── stores/    # Zustand 스토어
├── docs/              # 문서 템플릿 (비개발자도 안전하게 접근)
│   ├── plan.md        # 기획 문서
│   ├── dev.md         # 개발 문서
│   ├── marketing.md   # 마케팅 문서
│   └── ppt.md         # 발표 스크립트
├── CLAUDE.md          # AI 에이전트 가이드
└── README.md          # 이 파일
```

## 배포 (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO&root-directory=frontend)

### 배포 방법
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. "Import Project" → 생성한 레포 선택
3. **Root Directory**를 `frontend`로 설정
4. "Deploy" 클릭
