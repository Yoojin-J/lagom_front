import { useState } from 'react';
import { DEFAULT_BANK_NAME } from '../constants/setup';

// 통장 목록을 저장하는 localStorage 키
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
    // id는 생성 시각(ms)으로 부여 — 고유성 보장 및 useSavingsRecords와 키 공유
    const id = Date.now();
    setBanks((prev) => {
      const isDefault = name === DEFAULT_BANK_NAME;
      let resolvedName = name;
      // 기본 이름('행복통장')으로 통장을 여러 개 만들 경우 자동으로 번호를 붙임
      // 예: 행복통장 → 행복통장2 → 행복통장3
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
    // 생성된 통장 id를 반환해 호출부에서 바로 해당 통장으로 이동할 수 있게 함
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

  // hasBank: 통장이 하나라도 있는지 여부 — 메인 화면에서 빈 상태/목록 분기에 사용
  return { banks, hasBank: banks.length > 0, createBank, updateBank, deleteBank };
};

export default useHappyBank;
