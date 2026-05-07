import Clover2 from '../../../assets/Clover2.svg';
import '../styles/BankSummaryCard.css';

function calcPeriodInfo(startDate, goalPeriod) {
  const start = new Date(startDate.replace(/\./g, '-'));
  const totalDays = goalPeriod * 30;
  const today = new Date();
  const daysElapsed = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(totalDays - daysElapsed, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + goalPeriod);
  const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '.');

  return {
    totalDays,
    daysElapsed: Math.min(daysElapsed, totalDays),
    daysRemaining,
    endDate: formatDate(end),
    startDate: formatDate(start),
  };
}

function BankSummaryCard({ bankInfo, onDeposit, onEdit }) {
  const { name, currentAmount, goalType, goalAmount, goalPeriod, startDate } = bankInfo;
  const periodInfo = goalType === 'period' ? calcPeriodInfo(startDate, goalPeriod) : null;

  return (
    <div className="bankSummaryCard">
      <div className="bankSummaryCard__topRow">
        <div className="bankSummaryCard__titleGroup">
          <span className="bankSummaryCard__iconWrap">
            <img src={Clover2} alt="" className="bankSummaryCard__icon" />
          </span>
          <span className="bankSummaryCard__name">{name}</span>
        </div>
        <button
          className="bankSummaryCard__editBtn"
          type="button"
          aria-label="행복통장 수정"
          onClick={onEdit}
        >
          <span />
          <span />
          <span />
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
        <button className="bankSummaryCard__btn bankSummaryCard__btn--takeout" type="button">
          행복인출
        </button>
        <button
          className="bankSummaryCard__btn bankSummaryCard__btn--deposit"
          onClick={onDeposit}
          type="button"
        >
          저금하기
        </button>
      </div>
    </div>
  );
}

export default BankSummaryCard;
