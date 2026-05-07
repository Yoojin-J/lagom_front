import React, { useMemo } from 'react'

const MonthlyAmount = ({
  allTransactions = [],
  selectedDate,
  getSummary,
}) => {

  // yearMonth를 계산 (의존성 관리 용이)
  const yearMonth = useMemo(() => {
    const date = selectedDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based

    return `${year}-${month}`;
  }, [selectedDate]);

  // 합계 배열 불러오기 
  // allTransactions가 바뀌었을 때 monthlyData가 재계산
  const monthlySummary = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) {
      return {};
    }
    const summary = getSummary(allTransactions, 'month');
    console.log("summary: ", summary);
    return summary;
  }, [allTransactions, getSummary]);

  // monthlyData 계산
  const monthlyData = useMemo(() => {
    const data = monthlySummary[yearMonth] || { income: 0, expense: 0 };

    return {
      income: data.income.toLocaleString(),
      expense: data.expense.toLocaleString()
    };
  }, [monthlySummary, yearMonth]);

  const { income, expense } = monthlyData;

  return (
    <div className='monthly-amount'>
      <div className='text-card'>
        <div>이번 달 총 지출</div>
        <div className='amountrow'>
          <div className='expense'>{expense}</div><div>원</div>
        </div>
      </div>
      <div className='text-card'>
        <div>이번 달 총 수입</div>
        <div className='amountrow'>
          <div className='income'>{income}</div><div>원</div>
        </div>
      </div>
    </div>
  )
}

export default MonthlyAmount