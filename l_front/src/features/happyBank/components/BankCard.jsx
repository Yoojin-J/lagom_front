import Clover2 from '../../../assets/Clover2.svg';
import '../styles/BankCard.css';

function calcPeriodInfo(startDate, goalPeriod) {
  const start = new Date(startDate.replace(/\./g, '-'));
  const totalDays = goalPeriod * 30;
  const daysElapsed = Math.min(Math.floor((new Date() - start) / (1000 * 60 * 60 * 24)), totalDays);
  return { daysElapsed, totalDays };
}

/**
 * 통장 목록에서 보이는 카드
 */
function BankCard({ bank, records, onClick }) {
  const { name, goalType, goalAmount, goalPeriod, startDate } = bank;

  const currentAmount = records.reduce((s, r) => s + r.amount, 0);
  const periodInfo = goalType === 'period' ? calcPeriodInfo(startDate, goalPeriod) : null;

  const progressPercent =
    goalType === 'amount'
      ? goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0
      : Math.min((periodInfo.daysElapsed / periodInfo.totalDays) * 100, 100);

  return (
    <button className="bankCard" type="button" onClick={onClick}>
      <div className="bankCard__top">
        <div className="bankCard__titleGroup">
          <span className="bankCard__iconWrap">
            <img src={Clover2} alt="" className="bankCard__icon" />
          </span>
          <span className="bankCard__name">{name}</span>
        </div>
        <div className="bankCard__amountGroup">
          {goalType === 'amount' ? (
            <>
              <span className="bankCard__current">{currentAmount.toLocaleString('ko-KR')}</span>
              <span className="bankCard__goal">/ {goalAmount.toLocaleString('ko-KR')}원</span>
            </>
          ) : (
            <>
              <span className="bankCard__current">{periodInfo.daysElapsed}</span>
              <span className="bankCard__goal">/ {periodInfo.totalDays}일</span>
            </>
          )}
        </div>
      </div>
      <div className="bankCard__track">
        <div className="bankCard__fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </button>
  );
}

export default BankCard;
