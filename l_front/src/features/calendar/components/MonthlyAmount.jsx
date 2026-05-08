import React, { useMemo } from 'react'

const MonthlyAmount = ({
  totalIncome,
  totalExpense,
}) => {
  return (
    <div className='monthly-amount'>
      <div className='text-card'>
        <div>이번 달 총 지출</div>
        <div className='amountrow'>
          <div className='expense'>{totalExpense.toLocaleString()}</div><div>원</div>
        </div>
      </div>
      <div className='text-card'>
        <div>이번 달 총 수입</div>
        <div className='amountrow'>
          <div className='income'>{totalIncome.toLocaleString()}</div><div>원</div>
        </div>
      </div>
    </div>
  )
}

export default MonthlyAmount