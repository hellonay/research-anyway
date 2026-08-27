# 데이터 저장 방식 (Data Storage)

## Decisions

- 여행 데이터(Trip, Day, 일정 항목, 정보 카드, 사진첩)는 `DATABASE_URL`(또는 `POSTGRES_URL`) 환경변수가 있으면 Postgres에, 없으면 서버 로컬 JSON 파일에 저장한다. Vercel 등 서버리스 배포에서는 DB를 쓰고, 로컬 `bun dev`에서는 여전히 파일을 쓴다.
- 사진 파일은 DB 모드에서는 별도 저장소 없이 base64로 인코딩해 Trip 데이터 안에 그대로 담는다. 파일 모드에서는 `public/uploads`에 저장한다.

## Boundaries

- DB 연결 문자열이 없으면 로컬 파일로 자동 대체된다. 로컬 개발은 DB 없이도 그대로 동작해야 한다.
- 사진을 base64로 담는 방식은 사진 수가 많아지거나 고해상도 사진이 쌓이면 Trip 데이터 전체가 커져 매번의 읽기/쓰기가 느려질 수 있다.

## Why

처음에는 DB를 설치·연동하는 과정 없이 "한 번에 구현하고 실제 동작으로 검증"할 수 있는 범위를 유지하려고 로컬 JSON 파일만 썼다. 그런데 실제로 Vercel에 배포해 보니, 서버리스 함수는 배포된 코드 디렉터리에 쓰기가 되지 않아 페이지를 렌더링할 때마다 서버 에러가 났다(아래 재검토 조건이 그대로 발생함). 로컬 개발 경험은 그대로 유지하면서 실제 서비스로 쓸 배포 환경만 DB로 바꾸는 것이 가장 적은 변경으로 문제를 해결하는 방법이었다.

## Reconsider when

- ~~파일 시스템이 휘발성인 환경(서버리스·컨테이너 등)에 배포해야 하는 시점~~ → 이미 발생해서 위 결정으로 반영함(2026-08-27, Vercel 프로덕션 배포에서 서버 에러로 확인).
- 사진 수가 많아져 Trip JSONB 하나의 크기나 매 쓰기 비용이 문제가 되면, 사진만 별도 오브젝트 스토리지(예: Vercel Blob)로 분리하는 것을 재검토한다.
- 여러 사람이 동시에 쓰기 작업을 자주 해 쓰기 충돌이 관찰되면 재검토한다.

## Still-rejected alternatives

- 사진 전용 오브젝트 스토리지(Vercel Blob 등) 도입 — 지금 규모에서는 별도 저장소를 하나 더 두는 것보다 Trip JSONB에 함께 담는 쪽이 설정이 적어 채택하지 않음; 사진 데이터가 커지면 재검토.

## Evidence worth preserving

- 로컬 `bun dev`는 문제 없이 동작했지만, 배포된 프로덕션(https://research-anyway.vercel.app/)에서는 React 에러 다이제스트 `635218922`(React 미니파이드 에러 #441: "An error occurred in the Server Components render")로 즉시 재현됐다. 원인은 `lib/trip/store.ts`가 `process.cwd()` 아래 `data/trip.json`을 읽기 전에 없으면 만들려고 시도한 것이었다.
