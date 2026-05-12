import { useState } from 'react';

const STORAGE_KEY = 'lagom_achievements';

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const useAchievements = () => {
  const [achievements, setAchievements] = useState(load);

  const addAchievement = ({ bankInfo, records }) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const happySavings = records
      .filter((r) => r.type === 'happy')
      .reduce((sum, r) => sum + r.amount, 0);
    const becomeSavings = records
      .filter((r) => r.type === 'become')
      .reduce((sum, r) => sum + r.amount, 0);

    setAchievements((prev) => {
      const next = [
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
          goalDate: bankInfo.goalDate,
          records,
        },
      ];
      save(next);
      return next;
    });
  };

  return { achievements, addAchievement };
};

export default useAchievements;
