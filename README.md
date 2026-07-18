# Kenneth App 홈페이지

개발자 **Kenneth App**의 여러 앱을 소개하고 홍보하는 공식 홈페이지입니다.

## 구성

- `index.html` — 랜딩 페이지 (개발자 소개 + 앱 목록 + 문의)

## 앱 추가/수정하는 방법

`index.html` 하단의 `<script>` 안에 있는 **`APPS` 목록**만 수정하면 앱 카드가 자동으로 만들어집니다. 항목 하나가 앱 카드 하나입니다.

```js
{
  name: "앱 이름",                    // 앱 이름
  category: "생산성",                 // 카테고리
  icon: "🚀",                        // 이모지 1개 또는 이미지 경로 ("images/myapp.png")
  iconBg: "linear-gradient(135deg, #4f6ef7, #8a5cf6)",  // 아이콘 배경색 (이미지면 무시)
  desc: "앱 소개 2~3문장",
  tags: ["기능 1", "기능 2"],         // 주요 기능 태그
  playUrl: "https://play.google.com/store/apps/details?id=...",  // 없으면 "" → "출시 예정" 표시
  appStoreUrl: "https://apps.apple.com/kr/app/.../id..."          // 없으면 "" → "출시 예정" 표시
}
```

- 스토어 링크를 빈 문자열(`""`)로 두면 버튼이 **"출시 예정"** 으로 회색 표시됩니다.
- 앱 개수는 자유롭게 늘리거나 줄일 수 있습니다.
- 현재 들어 있는 3개 앱은 예시이므로 실제 앱 정보로 교체하세요.

## 배포

정적 HTML 한 파일이라 GitHub Pages로 바로 배포할 수 있습니다.

1. GitHub 저장소 → **Settings** → **Pages**
2. Source를 배포할 브랜치로 설정하고 저장
3. `https://<사용자명>.github.io/KennethApp/` 에서 확인
