# Kenneth App 홈페이지

개발자 **Kenneth App**의 여러 앱을 소개하고 홍보하는 공식 홈페이지입니다.

## 구성

- `index.html` — 랜딩 페이지 (개발자 소개 + 앱 목록 + 문의)

## 다국어 지원

헤더의 🌐 언어 메뉴에서 **영어 · 한국어 · 일본어 · 중국어 · 러시아어 · 필리핀어(타갈로그어)** 를 선택할 수 있습니다.

- 처음 방문하면 브라우저 언어에 맞춰 자동 선택되고, 선택한 언어는 브라우저에 저장되어 다음 방문에도 유지됩니다.
- 사이트 공통 문구 번역은 `index.html`의 `I18N` 객체에 있습니다.
- 앱 소개 문구도 언어별로 넣을 수 있습니다 (아래 참고). 언어별 값이 없으면 영어 → 한국어 순으로 대체 표시됩니다.

## 앱 추가/수정하는 방법

`index.html` 하단의 `<script>` 안에 있는 **`APPS` 목록**만 수정하면 앱 카드가 자동으로 만들어집니다. 항목 하나가 앱 카드 하나입니다.

```js
{
  // 문자열 하나만 쓰면 모든 언어에서 같은 값이 표시됩니다.
  // 언어별로 다르게 쓰려면 { en: "...", ko: "...", ja: "...", zh: "...", ru: "...", fil: "..." } 형태로 적으세요.
  name: { en: "My App", ko: "내 앱" },
  category: { en: "Productivity", ko: "생산성" },
  icon: "🚀",                        // 이모지 1개 또는 이미지 경로 ("images/myapp.png")
  iconBg: "linear-gradient(135deg, #4f6ef7, #8a5cf6)",  // 아이콘 배경색 (이미지면 무시)
  desc: { en: "2–3 sentence intro", ko: "앱 소개 2~3문장" },
  tags: { en: ["Feature 1"], ko: ["기능 1"] },            // 주요 기능 태그
  note: { en: "Disclaimer", ko: "고지사항" },             // (선택) 카드 하단 작은 회색 글씨
  playUrl: "https://play.google.com/store/apps/details?id=...",
  appStoreUrl: "https://apps.apple.com/kr/app/.../id..."
}
```

- 스토어 링크를 빈 문자열(`""`)로 두면 버튼이 **"출시 예정"** 으로 회색 표시됩니다 (출시 준비 중인 경우).
- 스토어 링크에 `null`을 넣으면 그 버튼이 아예 표시되지 않습니다 (예: 안드로이드 전용 앱의 `appStoreUrl: null`).
- `note`는 넣지 않으면 표시되지 않습니다. 고지사항·면책 문구용입니다.
- 앱 개수는 자유롭게 늘리거나 줄일 수 있습니다.

### 분류 필터

앱 목록 위의 필터 버튼은 각 앱의 `flags` 배열로 결정됩니다. 한 앱이 여러 분류에 동시에 속할 수 있습니다.

| flag | 필터 이름 | 의미 |
|---|---|---|
| `both` | 안드로이드/아이폰 사용가능 | Google Play와 App Store 모두 출시 |
| `google` | 안드로이드 전용 | 현재 Google Play에서만 다운로드 가능 |
| `korean` | 한국어 전용 | 한국어만 지원하는 앱 |
| `dev` | 개발 진행중 | 아직 출시 전 |

```js
flags: ["google", "korean"]   // 안드로이드 전용 + 한국어 전용 두 필터에 모두 표시됨
```

해당하는 앱이 하나도 없는 필터는 버튼 자체가 표시되지 않습니다. 버튼 옆 숫자는 자동으로 계산됩니다.

### 개발 중인 앱

아직 출시 전인 앱은 `status: "dev"` 만 넣으면 스토어 버튼 대신 **"개발중"** 배지가 표시됩니다.

```js
{ name: "My App", icon: "images/myapp-icon.png", desc: DEV_DESC, status: "dev" }
```

- `DEV_DESC`는 개발 중인 앱들이 공통으로 쓰는 안내 문구입니다 (6개 언어 포함).
- `category`와 `tags`는 생략할 수 있습니다.
- 출시되면 `status` 줄을 지우고 `playUrl` / `appStoreUrl` 을 채워주세요.

## app-ads.txt

AdMob 광고 인증용 `app-ads.txt` 파일이 저장소 루트에 있습니다.

- 배포 주소: `https://gkimmulti-ui.github.io/KennethApp/app-ads.txt`
- **주의**: AdMob 크롤러는 IAB 규격에 따라 **도메인 루트**(`https://gkimmulti-ui.github.io/app-ads.txt`)만 확인합니다. 하위 경로에 있는 파일은 인식하지 못하므로, 실제 인증을 받으려면 `gkimmulti-ui.github.io` 저장소(사용자 사이트)를 따로 만들어 그곳에 같은 파일을 올리거나 커스텀 도메인을 연결해야 합니다.

## 배포

`claude/app-promo-homepage-u7x4ks` 브랜치에 푸시하면 GitHub Actions가 자동으로 `gh-pages` 브랜치에 배포합니다 (`.github/workflows/deploy-pages.yml`).

- 공개 주소: `https://gkimmulti-ui.github.io/KennethApp/`
- Pages 설정: 저장소 → **Settings** → **Pages** → Source `Deploy from a branch` → `gh-pages` / `(root)`
