import Clover2 from '../../../assets/icons/happybank/Clover2';
import SystemMore from '../../../assets/icons/common/SystemMore';
import '../styles/BankSummaryCard.css';

// 목표 기간 기준일 때 경과일, 남은 일수, D-day 등을 계산
function calcPeriodInfo(startDate, goalDate) {
  const start = new Date(startDate.replace(/\./g, '-'));
  const end = new Date(goalDate.replace(/\./g, '-'));
  const today = new Date();
  // 최솟값 1로 막아 0으로 나누는 상황 방지
  const totalDays = Math.max(Math.floor((end - start) / (1000 * 60 * 60 * 24)), 1);
  // 경과일은 0~totalDays 범위로 클램핑 (만기 초과 또는 시작 전 방지)
  const daysElapsed = Math.min(Math.max(Math.floor((today - start) / (1000 * 60 * 60 * 24)), 0), totalDays);
  // 남은 일수가 음수가 되지 않도록 처리
  const daysRemaining = Math.max(Math.floor((end - today) / (1000 * 60 * 60 * 24)), 0);
  const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '.');

  return {
    totalDays,
    daysElapsed,
    daysRemaining,
    endDate: formatDate(end),
    startDate: formatDate(start),
  };
}

// 목록 화면과 상세 화면 두 곳 모두에서 사용되는 카드 컴포넌트
// - 목록: onClick 전달 → 카드 전체 클릭으로 상세 이동
// - 상세: onClick 없음 → 클릭 불가 (cursor 스타일도 제거)
function BankSummaryCard({ bankInfo, onDeposit, onWithdraw, onEdit, onClick }) {
  const { name, currentAmount, goalType, goalAmount, goalDate, startDate } = bankInfo;
  const periodInfo = goalType === 'period' ? calcPeriodInfo(startDate, goalDate) : null;

  return (
    <div className="bankSummaryCard" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="bankSummaryCard__topRow">
        <div className="bankSummaryCard__titleGroup">
          <span className="bankSummaryCard__iconWrap">
            <Clover2 width={12.6} height={13.2} fill="#FFF" />
          </span>
          <span className="bankSummaryCard__name">{name}</span>
        </div>
        {/* 카드 클릭과 수정 버튼 클릭이 겹치지 않도록 stopPropagation 처리 */}
        <button
          className="bankSummaryCard__editBtn"
          type="button"
          aria-label="행복통장 수정"
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
        >
          <SystemMore width={24} height={24} stroke="#B1B8BE" />
        </button>
      </div>

      {/* 목표 유형에 따라 표시 내용이 달라짐 */}
      {goalType === 'period' ? (
        <div className="bankSummaryCard__periodRow">
          <div className="bankSummaryCard__amounts">
            <span className="bankSummaryCard__current">{periodInfo.daysElapsed}</span>
            <span className="bankSummaryCard__goal">/ {periodInfo.totalDays}일</span>
            <span className="bankSummaryCard__dday">D-{periodInfo.daysRemaining}</span>
          </div>
          <span className="bankSummaryCard__dateRange">
            {periodInfo.startDate} - {periodInfo.endDate}
          </span>
        </div>
      ) : (
        <div className="bankSummaryCard__amounts">
          <span className="bankSummaryCard__current">{(currentAmount ?? 0).toLocaleString('ko-KR')}</span>
          <span className="bankSummaryCard__goal">/ {(goalAmount ?? 0).toLocaleString('ko-KR')}원</span>
        </div>
      )}

      <div className="bankSummaryCard__actions">
        {/* 행복인출/저금하기도 카드 클릭과 분리되도록 stopPropagation 처리 */}
        <button
          className="bankSummaryCard__btn bankSummaryCard__btn--takeout"
          onClick={(e) => { e.stopPropagation(); onWithdraw?.(); }}
          type="button"
        >
          행복인출
        </button>
        <button
          className="bankSummaryCard__btn bankSummaryCard__btn--deposit"
          onClick={(e) => { e.stopPropagation(); onDeposit?.(); }}
          type="button"
        >
          저금하기
        </button>
      </div>
    </div>
  );
}

export default BankSummaryCard;
