import '../styles/EmptyAchievementState.css';

function EmptyAchievementState() {
  return (
    <div className="emptyAchievementState">
      <span className="emptyAchievementState__icon" />
      <p className="emptyAchievementState__text">완료된 저금 기록이 없습니다</p>
    </div>
  );
}

export default EmptyAchievementState;
