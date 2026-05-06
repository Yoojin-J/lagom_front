import AchievementListItem from './AchievementListItem';
import '../styles/AchievementList.css';

function AchievementList({ achievements, onItemClick }) {
  return (
    <div className="achievementList">
      {achievements.map((achievement) => (
        <AchievementListItem
          key={achievement.id}
          achievement={achievement}
          onClick={() => onItemClick(achievement)}
        />
      ))}
    </div>
  );
}

export default AchievementList;
