import { useState } from 'react';

const STORAGE_KEY = 'lagom_banks';

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const useHappyBank = () => {
  const [banks, setBanks] = useState(load);

  const createBank = ({ name, goalType, goalAmount, goalPeriod }) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const id = Date.now();
    setBanks((prev) => {
      const next = [...prev, { id, name, goalType, goalAmount: Number(goalAmount), goalPeriod: Number(goalPeriod), startDate: today }];
      save(next);
      return next;
    });
    return id;
  };

  const updateBank = (id, { name, goalType, goalAmount, goalPeriod }) => {
    setBanks((prev) => {
      const next = prev.map((b) =>
        b.id === id
          ? { ...b, name, goalType, goalAmount: Number(goalAmount), goalPeriod: Number(goalPeriod) }
          : b
      );
      save(next);
      return next;
    });
  };

  const deleteBank = (id) => {
    setBanks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      save(next);
      return next;
    });
  };

  return { banks, hasBank: banks.length > 0, createBank, updateBank, deleteBank };
};

export default useHappyBank;
