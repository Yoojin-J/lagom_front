import { useState } from 'react';
import AchievementList from './components/AchievementList';
import EmptyAchievementState from './components/EmptyAchievementState';
import './styles/page.css';

function AchievementPage({ achievements }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  return (
    <div className="achievementPage">
      {achievements.length === 0 ? (
        <EmptyAchievementState />
      ) : (
        <AchievementList
          achievements={achievements}
          onItemClick={(a) => setSelectedAchievement(a)}
        />
      )}
    </div>
  );
}

export default AchievementPage;
