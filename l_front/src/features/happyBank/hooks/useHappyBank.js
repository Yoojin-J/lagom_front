import { useState } from 'react';
import { DEFAULT_BANK_NAME } from '../constants/setup';

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

  const createBank = ({ name, goalType, goalAmount, goalDate }) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const id = Date.now();
    setBanks((prev) => {
      const isDefault = name === DEFAULT_BANK_NAME;
      let resolvedName = name;
      if (isDefault) {
        const defaultCount = prev.filter(
          (b) => b.name === DEFAULT_BANK_NAME || /^행복통장\d+$/.test(b.name)
        ).length;
        resolvedName = defaultCount === 0 ? DEFAULT_BANK_NAME : `${DEFAULT_BANK_NAME}${defaultCount + 1}`;
      }
      const next = [...prev, { id, name: resolvedName, goalType, goalAmount: Number(goalAmount), goalDate, startDate: today }];
      save(next);
      return next;
    });
    return id;
  };

  const updateBank = (id, { name, goalType, goalAmount, goalDate }) => {
    setBanks((prev) => {
      const next = prev.map((b) =>
        b.id === id
          ? { ...b, name, goalType, goalAmount: Number(goalAmount), goalDate }
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
