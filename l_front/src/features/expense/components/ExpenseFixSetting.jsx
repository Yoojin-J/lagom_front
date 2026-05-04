import React from 'react'
import DatePicker from './DatePickerExpense';

const ExpenseFixSetting = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedCycle,
  setSelectedCycle,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  weekList,
}) => {
  const handlePeriod = (e) => {
    const period = e.currentTarget.dataset.value;

    setSelectedPeriod(period);
  };

  const handleCycle = (value) => {
    setSelectedCycle((prev) => {
      // 이미 선택되어 있다면 제거 (Filter)
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      // 선택되어 있지 않다면 추가 (Spread)
      return [...prev, value];
    });
  };

  return (
    <div className='fix-setting'>
      <div className='cycle-setting'>
        <div className='label'>반복주기</div>

        <div className='setting-bar'>
          <div
            data-value='day'
            className={`tab ${selectedPeriod === 'day' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매일
          </div>
          <div
            data-value='week'
            className={`tab ${selectedPeriod === 'week' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매주
          </div>
          <div
            data-value='month'
            className={`tab ${selectedPeriod === 'month' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매월
          </div>
        </div>
        {selectedPeriod === 'week' &&
          <div className='cycle'>
            {selectedPeriod && weekList.map((week) => {
              return (
                <div
                  key={week.value}
                  className={`cycle-chip ${selectedCycle.includes(week.value) ? 'selected' : ''}`}
                  onClick={() => handleCycle(week.value)}
                >
                  {week.label}
                </div>
              );
            })}
          </div>}

        {selectedPeriod === 'month' &&
          <div className='cycle'>
            {selectedPeriod && Array.from({ length: 31 }, (_, i) => {
              return (
                <div
                  key={i + 1}
                  className={`cycle-chip ${selectedCycle.includes(i + 1) ? 'selected' : ''}`}
                  onClick={() => handleCycle(i + 1)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>}
      </div>
      <div className='start-date'>
        <div className='label'>시작일</div>
        <div className='input-content'>
          <DatePicker
            selectedDate={startDate}
            setSelectedDate={setStartDate}
          />
        </div>
      </div>
      <div className='end-date'>
        <div className='label'>종료일</div>
        <div className='input-content'>
          <DatePicker
            selectedDate={endDate}
            setSelectedDate={setEndDate}
          />
        </div>
      </div>
    </div>
  )
}

export default ExpenseFixSetting