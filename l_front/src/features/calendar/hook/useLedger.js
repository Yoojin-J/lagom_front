import { useMemo } from 'react';
import { formatDate } from './dateUtil.js';

export const useLedger = (records, currentMonth) => {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return { itemsByDate: {}, totalIncome: 0, totalExpense: 0 };
    }

    let totalIncome = 0;
    let totalExpense = 0;

    console.log("useLedger currentMonth", currentMonth);

    const itemsByDate = records.reduce((acc, cur) => {
      const month = new Date(cur.payment_at).getMonth() + 1;
      // console.log(new Date(cur.payment_at));
      // console.log("useLedger month currentMonth", month, currentMonth);

      const dateKey = formatDate(cur.payment_at); // "2026-05-01" 형태

      if (!acc[dateKey]) {
        acc[dateKey] = { dayItems: [], dayIncome: 0, dayExpense: 0 };
      }

      acc[dateKey].dayItems.push(cur);

      if (cur.type === 1) {
        acc[dateKey].dayIncome += cur.amount;
        if (month !== currentMonth) return acc;

        totalIncome += cur.amount;
      } else {
        acc[dateKey].dayExpense += cur.amount;
        if (month !== currentMonth) return acc;

        totalExpense += cur.amount;
      }

      return acc;
    }, {});

    return { itemsByDate, totalIncome, totalExpense };
  }, [records, currentMonth]);
};