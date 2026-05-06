import { useState } from 'react';

const useHappyBank = () => {
  const [banks, setBanks] = useState([]);

  // 새 통장 생성, 생성된 bankId 반환
  const createBank = ({ name, goalType, goalAmount, goalPeriod }) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const id = Date.now();
    setBanks((prev) => [
      ...prev,
      {
        id,
        name,
        goalType,
        goalAmount: Number(goalAmount),
        goalPeriod: Number(goalPeriod),
        startDate: today,
      },
    ]);
    return id;
  };

  const updateBank = (id, { name, goalType, goalAmount, goalPeriod }) => {
    setBanks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, name, goalType, goalAmount: Number(goalAmount), goalPeriod: Number(goalPeriod) }
          : b
      )
    );
  };

  const deleteBank = (id) => {
    setBanks((prev) => prev.filter((b) => b.id !== id));
  };

  return { banks, hasBank: banks.length > 0, createBank, updateBank, deleteBank };
};

export default useHappyBank;
