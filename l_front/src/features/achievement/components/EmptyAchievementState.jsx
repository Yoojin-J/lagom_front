import '../styles/EmptyAchievementState.css';

// 성취 기록관에 기록된 저금이 없을 때
function EmptyAchievementState() {
  return (
    <div className="emptyAchievementState">
      <span className="emptyAchievementState__icon" />
      <p className="emptyAchievementState__text">완료된 저금 기록이 없습니다</p>
    </div>
  );
}

export default EmptyAchievementState;
