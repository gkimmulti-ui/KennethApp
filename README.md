# KennethApp 홈페이지

KennethApp을 소개하고 홍보하는 공식 홈페이지입니다.

## 구성

- `index.html` — 랜딩 페이지 (앱 소개, 주요 기능, 다운로드 링크)

## 앱 스토어 링크 교체하기

앱이 스토어에 등록되면 `index.html`에서 아래 두 링크를 실제 주소로 교체하세요 (히어로 섹션과 다운로드 섹션에 각각 한 번씩, 총 두 곳):

- **Google Play**: `https://play.google.com/store/apps/details?id=com.kenneth.app` → 실제 패키지 ID로 교체
- **App Store**: `https://apps.apple.com/kr/app/kennethapp/id0000000000` → 실제 앱 ID로 교체

## 배포

정적 HTML 한 파일로 되어 있어 GitHub Pages로 바로 배포할 수 있습니다.

1. GitHub 저장소 → **Settings** → **Pages**
2. Source를 배포할 브랜치로 설정하고 저장
3. `https://<사용자명>.github.io/KennethApp/` 에서 확인
