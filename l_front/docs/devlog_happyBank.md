# happyBank 개발 일지

---

## [happyBank] HappyBankPage

- 행복통장 탭의 메인 진입점 (레이아웃 라우터 역할)

## 📌 개요

- 관련 컴포넌트: `BankStartCard`, `BankSummaryCard`, `EmptyBankState`, `SavingsRecordList`, `SavingsRecordModal`, `DepositPage`
- 관련 훅: `useSavingsRecords`

## ✅ 작업 로그

### 2026-04-15

- `page.jsx` 초기 생성. `currentView` state로 main/setup/deposit 화면 전환
- `useHappyBank` 훅으로 통장 정보 관리

### 2026-04-16

- setup 뷰를 `App.jsx` 레벨로 끌어올림 → BankSetupPage가 Header/NavigationBar 없이 전체 화면으로 렌더링되도록 변경
- `bankInfo`, `hasBank`를 App.jsx에서 props로 내려받는 구조로 변경 (hook 이중 호출로 인한 state 공유 불가 문제 해결)

### 2026-04-29

- `enrichedBankInfo` 계산 로직 추가: records에서 happySavings/becomeSavings를 실시간 집계해 bankInfo에 병합
- `DepositPage` 전환 연결

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| 행복통장 탭 클릭 시 Header/Nav도 함께 안 보임 | setup 뷰가 HappyBankPage 내부에서 렌더링됨 | setup 상태를 App.jsx로 올려 Header/Nav 없이 BankSetupPage만 렌더링 |
| createBank 후 hasBank가 갱신 안 됨 | HappyBankPage와 App.jsx가 각각 useHappyBank 호출 → 별개의 state | useHappyBank를 App.jsx에서만 호출, props로 전달 |
| 행복통장 탭 클릭 시 화면 전체가 왼쪽으로 쏠림 | page.css의 `min-height: 546px`이 수직 스크롤바를 유발 → document 너비 축소 → `margin: 0 auto` 계산 틀어짐 | `min-height` 제거, `flex: 1` 사용 |

## 💻 핵심 코드

```jsx
// App.jsx에서 useHappyBank를 단일 소유
const { bankInfo, hasBank, createBank } = useHappyBank();

// setup 뷰: Header/Nav 없이 전체 화면
if (currentView === 'setup') {
  return (
    <div className='app_content'>
      <BankSetupPage onComplete={handleSetupComplete} onBack={() => setCurrentView('main')} />
    </div>
  );
}
```
- setup 화면이 Header/Nav를 덮어야 하므로 조건 분기를 App 최상단에서 처리
- `useHappyBank`를 App에서만 소유해야 `createBank` 후 `HappyBankPage`의 `hasBank`가 즉시 반영됨

---

## [happyBank] BankStartCard

- 행복통장 미개설 상태 진입 카드 (클릭 시 통장 개설 플로우 시작)

## 📌 개요

- 관련 컴포넌트: `BankSetupPage` (클릭 시 진입)
- 관련 훅: 없음

## ✅ 작업 로그

### 2026-04-15

- 초기 구현: 클로버 아바타 + "행복해지고 싶다면?" 서브텍스트 + "행복저금 시작하기" 타이틀 + 화살표 아이콘
- `onClick` prop으로 App.jsx의 `setCurrentView('setup')` 콜백 연결

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| 없음 | — | — |

## 💻 핵심 코드

```jsx
function BankStartCard({ onClick }) {
  return (
    <div className="bankStartCard" onClick={onClick}>
      <div className="bankStartCard__avatar">
        <img src={Clover2} alt="clover" />
      </div>
      <div className="bankStartCard__text">
        <span className="bankStartCard__sub">행복해지고 싶다면?</span>
        <span className="bankStartCard__title">행복저금 시작하기</span>
      </div>
      <span className="bankStartCard__arrow">
        <img src={ChevronIcon} alt="chevron" />
      </span>
    </div>
  );
}
```
- 카드 전체가 클릭 가능한 단순 프레젠테이셔널 컴포넌트
- 비즈니스 로직 없이 `onClick`만 prop으로 받아 상위에서 뷰 전환을 제어

---

## [happyBank] BankSetupPage

- 통장 개설 플로우 페이지 (통장 이름 입력 + 목표 설정 + 개설 완료 모달)

## 📌 개요

- 관련 컴포넌트: `GoalTabSwitch`, `GoalAmountInput`, `GoalPeriodInput`, `SetupCompleteModal`
- 관련 훅: 없음 (상태 직접 관리)
- 관련 상수: `constants/setup.js` (`DEFAULT_BANK_NAME`, `MAX_NAME_LENGTH`, `GOAL_AMOUNT_MIN/MAX`, `GOAL_PERIOD_MIN/MAX`)

## ✅ 작업 로그

### 2026-04-15

- BankSetupPage 초기 구현: 뒤로가기 버튼, 아바타, 이름 input, GoalTabSwitch, 확인 버튼

### 2026-04-28

- 아바타 class명 오류 수정 (`bankStartCard__avatar` → `bankSetupPage__avatar`)
- 아바타 배경 green(`#A9DAB4`)으로 변경, Clover2 이미지 중앙 정렬
- 연필 이모지 → `Edit.svg` img 태그로 교체
- 컨테이너 `align-items: flex-start` 제거 → 자식 full-width 정렬 복구
- 이중 padding 제거 (컨테이너 + 개별 섹션 각각 padding하던 구조 정리)

### 2026-04-29

- 통장 이름 필드 인터랙션 구현:
  - **기본 상태**: `<span>` 텍스트 + 연필 아이콘 버튼 (클릭 시 편집 모드)
  - **편집 상태**: 밑줄 input + 글자수 카운트(`n/20`) + 삭제 버튼
  - **에러 상태**: 특수문자 입력 시 에러 메시지 표시
  - blur 시 빈값이면 `'행복통장'`으로 자동 복원
- 확인 버튼 활성화 로직: `isValid`일 때 핑크 3D 그림자 스타일 적용
- 상수 파일(`constants/setup.js`) 분리

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| 연필 아이콘이 "행복통장" 텍스트와 너무 멀리 떨어짐 | input의 `min-width: 80px`이 텍스트 길이와 무관하게 공간 차지 | 기본 상태에서 `<input>` 대신 `<span>` 사용, gap을 4px로 좁힘 |
| blur 시 clear 버튼 클릭이 안 됨 | input blur가 먼저 발생해 편집 모드 해제 → clear 버튼 DOM에서 제거됨 | clear 버튼에 `onMouseDown={(e) => e.preventDefault()}` 추가로 blur 방지 |
| 컴포넌트들이 전체적으로 왼쪽으로 쏠림 | `align-items: flex-start`로 자식들이 full-width로 늘어나지 않음 + 이중 padding | `align-items: flex-start` 제거, 컨테이너 padding 통일 |

## 💻 핵심 코드

```jsx
// 편집/기본 상태 분기
{isEditingName ? (
  <div className="bankSetupPage__nameEditArea">
    <div className={`bankSetupPage__nameInputRow ${nameError ? '--error' : ''}`}>
      <input ref={inputRef} ... onBlur={handleNameBlur} />
      <span className="bankSetupPage__nameCount">{bankName.length}/{MAX_NAME_LENGTH}</span>
      <button onMouseDown={(e) => e.preventDefault()} onClick={handleNameClear}>...</button>
    </div>
    {nameError && <p className="bankSetupPage__nameError">...</p>}
  </div>
) : (
  <div className="bankSetupPage__nameRow" onClick={handleEditStart}>
    <span className="bankSetupPage__nameText">{bankName}</span>
    <img src={EditIcon} className="bankSetupPage__pencil" />
  </div>
)}

// 확인 버튼 활성화
<button className={`bankSetupPage__confirmBtn ${isValid ? 'bankSetupPage__confirmBtn--active' : ''}`}>
  확인
</button>
```
- `onMouseDown preventDefault`는 React의 이벤트 처리 순서(mousedown → blur → click) 특성을 이용해 blur를 막는 표준 패턴

---

## [happyBank] GoalTabSwitch

- 목표금액 / 목표기간 탭 전환 컴포넌트

## 📌 개요

- 관련 컴포넌트: `BankSetupPage`에서 사용
- 관련 훅: 없음 (상태 BankSetupPage에서 관리)

## ✅ 작업 로그

### 2026-04-15

- 초기 구현: `activeTab` prop으로 활성 탭 결정, `onTabChange` 콜백으로 상위에 알림

### 2026-04-28~29

- 피그마 기준 스타일 적용:
  - 컨테이너: `background: #F4F5F6; border-radius: 8px; padding: 4px; gap: 7px`
  - 비활성 탭: 투명 배경, 회색 텍스트
  - 활성 탭: `background: #FFF; border-radius: 6px`
- 탭 width를 고정값(`156px`) → `flex: 1`로 변경 (컨테이너 overflow 방지)

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| 탭 활성 시 여백이 비대칭 | 두 탭 고정 width(156px) + gap(18px) = 330px > 컨테이너 content 327px | 탭을 `flex: 1`로 변경해 컨테이너 안에서 균등 분배 |

## 💻 핵심 코드

```jsx
<div className="goalTabSwitch">
  <button
    className={`goalTabSwitch__tab ${activeTab === 'amount' ? 'goalTabSwitch__tab--active' : ''}`}
    onClick={() => onTabChange('amount')}
  >목표금액</button>
  <button
    className={`goalTabSwitch__tab ${activeTab === 'period' ? 'goalTabSwitch__tab--active' : ''}`}
    onClick={() => onTabChange('period')}
  >목표기간</button>
</div>
```
- 활성 상태를 `--active` modifier 클래스로 분리해 CSS만으로 스타일 전환

---

## [happyBank] GoalAmountInput / GoalPeriodInput

- 목표금액 / 목표기간 입력 필드 (숫자 전용, 범위 검증, 포커스/에러 상태 관리)

## 📌 개요

- 관련 컴포넌트: `BankSetupPage`에서 사용
- 관련 훅: 없음
- 관련 상수: `GOAL_AMOUNT_MIN(10,000)`, `GOAL_AMOUNT_MAX(100,000,000)`, `GOAL_PERIOD_MIN(1)`, `GOAL_PERIOD_MAX(36)`

## ✅ 작업 로그

### 2026-04-15

- 초기 구현: 숫자만 허용 필터, 포커스 시 밑줄 색 변경, clear 버튼

### 2026-04-29

- 구조 개편: `wrapper > fieldRow + underline` 구조로 변경
  - `fieldRow`: input + unit + clear 버튼이 수평 배열, `align-items: baseline`으로 텍스트 기준선 정렬
  - `underline`: 별도 `<div>`로 분리해 포커스/에러 상태별 색상 제어
- `hasTouched` state 추가: 한 번 입력 후 포커스 해제 시에만 에러 표시 (UX 개선)
- GoalAmountInput: 숫자 포맷팅(`toLocaleString('ko-KR')`) 적용
- 에러/힌트 메시지에 `FeedbackIcon` 아이콘 추가
- 상수 파일에서 MIN/MAX 값 import

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| "원"/"개월" 텍스트가 세로로 서는 현상 | `flex-shrink: 0`, `white-space: nowrap` 미설정으로 input의 `flex: 1`에 밀려 shrink됨 | 두 속성 추가 |
| "원"/"개월"이 input "0"과 수직 정렬이 안 맞음 | `<input>` 요소는 브라우저가 기본 높이를 크게 렌더링 → `flex-end`로는 시각적 기준선이 불일치 | `align-items: baseline`으로 변경해 텍스트 기준선 일치 |
| 밑줄(underline) 색 제어가 복잡 | `border-bottom`이 wrapper에 있으면 포커스/에러 modifier 클래스 조합이 번잡 | underline을 별도 `<div className="goalAmountInput__underline">`으로 분리, wrapper의 `--focused`/`--error` 클래스에서 자식 선택자로 색상 제어 |

## 💻 핵심 코드

```jsx
// fieldRow: baseline 정렬로 "0"과 "원" 텍스트 기준선 일치
<div className="goalAmountInput__fieldRow">
  <input ... placeholder="0" />
  <span className="goalAmountInput__unit">원</span>
  {isFocused && hasValue && <button className="goalAmountInput__clear">...</button>}
</div>
// underline: 상태별 색상을 CSS 자식 선택자로 제어
<div className="goalAmountInput__underline" />
```

```css
/* wrapper의 상태 클래스 → underline 자식 선택 */
.goalAmountInput__wrapper--focused .goalAmountInput__underline { background: #ffb0ad; }
.goalAmountInput__wrapper--error   .goalAmountInput__underline { background: #de3412; }
```
- `hasTouched`: 최초 포커스 전에는 에러를 보여주지 않아 UX 향상 (처음부터 빨간 상태로 시작하지 않음)
- clear 버튼은 `isFocused && hasValue`일 때만 렌더링 (불필요한 UI 제거)

---

## [happyBank] SetupCompleteModal

- 통장 개설 완료 확인 모달

## 📌 개요

- 관련 컴포넌트: `BankSetupPage`에서 조건부 렌더링
- 관련 훅: 없음

## ✅ 작업 로그

### 2026-04-15

- 초기 구현: 오버레이 + 개설 완료 메시지 + 확인/저금하기 버튼

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| "저금하기" 버튼 미연결 | DepositPage 미구현 | TODO로 보류 |

## 💻 핵심 코드

```jsx
// BankSetupPage에서의 호출
{showModal && (
  <SetupCompleteModal bankName={bankName} onConfirm={handleModalConfirm} />
)}

// handleModalConfirm: 모달 닫고 상위에 완료 알림
const handleModalConfirm = () => {
  setShowModal(false);
  onComplete?.({ name: bankName.trim() || DEFAULT_BANK_NAME, goalType, goalAmount, goalPeriod });
};
```
- 개설 완료 → 모달 표시 → 확인 버튼 → `onComplete` 콜백 → App.jsx에서 `createBank` 호출 후 메인 화면 복귀

---

## [happyBank] useHappyBank

- 행복통장 정보 조회/생성 훅 (현재 로컬 상태, 추후 API 연동 예정)

## 📌 개요

- 관련 컴포넌트: `App.jsx`에서 단일 소유
- 관련 훅: 없음

## ✅ 작업 로그

### 2026-04-15

- `bankInfo` 초기값 `null` (미개설), `createBank()` 호출 시 통장 정보 객체 세팅
- `hasBank: bankInfo !== null` 파생값으로 통장 보유 여부 판단

## 🐛 이슈 & 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| createBank 후 hasBank 미반영 | HappyBankPage와 App.jsx가 각각 훅 호출 → 별개 state 인스턴스 | App.jsx에서만 호출, props로 전달 |

## 💻 핵심 코드

```js
const createBank = ({ name, goalType, goalAmount, goalPeriod }) => {
  setBankInfo({
    name,
    currentAmount: 0,
    goalAmount: goalType === 'amount' ? Number(goalAmount) : 0,
    goalPeriod: goalType === 'period' ? Number(goalPeriod) : null,
    happySavings: 0,
    becomeSavings: 0,
    goalType,
    startDate: '2026.04.14',
  });
};
// TODO: API 연동 후 setBankInfo → API call로 교체
```
- `startDate`는 현재 하드코딩 → API 연동 시 서버 응답값으로 교체 필요
