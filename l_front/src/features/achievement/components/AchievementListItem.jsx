import '../styles/AchievementListItem.css';

function AchievementListItem({ achievement, onClick }) {
  const { id, name, startDate, endDate, totalAmount } = achievement;

  return (
    <button className="achievementListItem" type="button" onClick={onClick}>
      <div className="achievementListItem__left">
        <p className="achievementListItem__title">{id}회차 {name}</p>
        <p className="achievementListItem__date">{startDate} – {endDate}</p>
      </div>
      <p className="achievementListItem__amount">
        {totalAmount.toLocaleString('ko-KR')}원
      </p>
    </button>
  );
}

export default AchievementListItem;
