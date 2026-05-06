import { useState } from 'react';

const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);

  const addAchievement = ({ bankInfo, records }) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const happySavings = records
      .filter((r) => r.type === 'happy')
      .reduce((sum, r) => sum + r.amount, 0);
    const becomeSavings = records
      .filter((r) => r.type === 'become')
      .reduce((sum, r) => sum + r.amount, 0);

    setAchievements((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: bankInfo.name,
        startDate: bankInfo.startDate,
        endDate: today,
        totalAmount,
        happySavings,
        becomeSavings,
        goalType: bankInfo.goalType,
        goalAmount: bankInfo.goalAmount,
        goalPeriod: bankInfo.goalPeriod,
        records,
      },
    ]);
  };

  return { achievements, addAchievement };
};

export default useAchievements;
