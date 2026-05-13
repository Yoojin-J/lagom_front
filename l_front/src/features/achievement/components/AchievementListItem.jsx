import '../styles/AchievementListItem.css';

// 성취 기록관 회차별 리스트 아이템 카드 컴포넌트
function AchievementListItem({ achievement, onClick }) {
  const { id, name, startDate, endDate, totalAmount } = achievement;

  return (
    <button className="achievementListItem" type="button" onClick={onClick}>
      <div className="achievementListItem__left">
        <p className="achievementListItem__title">{id}회차 행복통장</p>
        <p className="achievementListItem__date">{startDate} – {endDate}</p>
      </div>
      <p className="achievementListItem__amount">
        {totalAmount.toLocaleString('ko-KR')}원
      </p>
    </button>
  );
}

export default AchievementListItem;
