import React from 'react'

const ExpenseMemo = ({
  memo,
  setMemo,
}) => {
  return (
    <div className='memo-content'>
      <label for='memo'>메모</label>
      <div className='input-content'>
        <input
          type='text'
          id='memo'
          name='memo'
          placeholder='메모할 내용을 적어주세요'
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        ></input>
      </div>
    </div>
  )
}

export default ExpenseMemo