import { useState } from 'react';

/**
 * 행복통장 정보 조회/수정 훅
 * @returns {{ bankInfo: object|null, hasBank: boolean, createBank: Function }}
 */
const useHappyBank = () => {
  // TODO: API 연동 후 교체 (null = 미개설, object = 개설됨)
  const [bankInfo, setBankInfo] = useState(null);

  const createBank = ({ name, goalType, goalAmount, goalPeriod }) => {
    setBankInfo({
      name,
      currentAmount: 0,
      goalAmount: goalType === 'amount' ? Number(goalAmount) : 0,
      goalPeriod: goalType === 'period' ? Number(goalPeriod) : null,
      happySavings: 0,
      becomeSavings: 0,
      goalType,
      startDate: '2026.04.14',
    });
  };

  return { bankInfo, hasBank: bankInfo !== null, createBank };
};

export default useHappyBank;
