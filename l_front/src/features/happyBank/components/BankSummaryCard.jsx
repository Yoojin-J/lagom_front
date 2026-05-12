import Clover2 from '../../../assets/icons/happybank/Clover2';
import SystemMore from '../../../assets/icons/common/SystemMore';
import '../styles/BankSummaryCard.css';

function calcPeriodInfo(startDate, goalDate) {
  const start = new Date(startDate.replace(/\./g, '-'));
  const end = new Date(goalDate.replace(/\./g, '-'));
  const today = new Date();
  const totalDays = Math.max(Math.floor((end - start) / (1000 * 60 * 60 * 24)), 1);
  const daysElapsed = Math.min(Math.max(Math.floor((today - start) / (1000 * 60 * 60 * 24)), 0), totalDays);
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
        <button
          className="bankSummaryCard__editBtn"
          type="button"
          aria-label="행복통장 수정"
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
        >
          <SystemMore width={24} height={24} stroke="#B1B8BE" />
        </button>
      </div>

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
