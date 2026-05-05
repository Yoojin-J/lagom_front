import React, { useRef, useEffect, useState, useMemo } from 'react'
import testTransactions from '../../assets/data/expense3.json';
import ListIcon from '../../assets/icons/calendar/List.jsx';
import CalendarIcon from '../../assets/icons/calendar/Calendar.jsx';
import AlertRoundFillIcon from '../../assets/icons/calendar/AlertRoundFill.jsx';
import ChevronRight from '../../assets/icons/common/ChevronRight.jsx';
import DatePicker from './components/DatePickerCalendar.jsx';
import MonthlyAmount from './components/MonthlyAmount.jsx';
import GoExpense from './components/GoExpense.jsx';
import './styles/CalendarPage.css';
import TransactionHistory from './components/TransactionHistory.jsx';
import CalendarBody from './components/CalendarBody.jsx';


const CalendarPage = () => {

  const currentDate = new Date(); //오늘
  const [selectedDate, setSelectedDate] = useState(new Date); // 선택된 날짜

  const [isWeekView, setIsWeekView] = useState(true); // 주간달력인가요? true 디폴트

  const [weekStartDate, setWeekStartDate] = useState(null); // 한 주의 시작 날짜 구하기(월요일 날짜)

  // 전체 거래 데이터 (배열 형태)
  const [allTransactions, setAllTransactions] = useState([]);
  // 선택한 날짜의 거래 목록
  const [selectedDayTransactions, setSelectedDayTransactions] = useState([]);

  // 한 주의 시작 날짜 가져오기 함수
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // 날짜 문자열 (YYYY-MM-DD)
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 전체 거래 데이터 불러오기 (한 번만 실행)
  const fetchAllTransactions = () => {
    try {
      const data = testTransactions;
      setAllTransactions(data || []);
      console.log("testdata: ", testTransactions);
      console.log("alltran: ", allTransactions);
    } catch (error) {
      console.error("거래 데이터 불러오기 실패", error);
      setAllTransactions([]);
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    const initialWeekStart = getStartOfWeek(currentDate);
    setWeekStartDate(initialWeekStart);
    setSelectedDate(currentDate);
    fetchAllTransactions();   // 전체 데이터 불러오기
  }, []);

  // 선택한 날짜 변경 시 해당 날짜 거래 내역 필터링
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    const filtered = allTransactions.filter(item => item.payment_at.substring(0, 10) === dateKey);
    setSelectedDayTransactions(filtered);

  }, [selectedDate, allTransactions]);

  // ==================== 월 이동 ====================
  const moveToMonth = (newMonthDate) => {
    const targetYear = newMonthDate.getFullYear();
    const targetMonth = newMonthDate.getMonth();

    let newSelectedDay = selectedDate.getDate();
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    if (newSelectedDay > lastDay) newSelectedDay = lastDay;

    const newSelectedDate = new Date(targetYear, targetMonth, newSelectedDay);
    setSelectedDate(newSelectedDate);
    setIsWeekView(false);
  };

  const showSelectedWeek = () => {
    setWeekStartDate(getStartOfWeek(selectedDate));
    setIsWeekView(true);
  };

  const showFullMonth = () => {
    setIsWeekView(false);
    setWeekStartDate(null);
  };

  

  const getSummary = (transactions, period = 'day') => {
    return transactions.reduce((acc, tx) => {
      let key;

      if (period === 'month') {
        key = tx.payment_at.substring(0, 7);        // "2026-04"
      } else if (period === 'year') {
        key = tx.payment_at.substring(0, 4);        // "2026"
      } else {
        key = tx.payment_at.split('T')[0];          // "2026-04-13" (기존 일별)
      }

      const amount = tx.amount;
      const type = tx.type;

      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }

      if (type === 1) {
        acc[key].income += amount;
      } else {
        acc[key].expense += amount;
      }

      return acc;
    }, {});
  };

  





  return (
    <div className='calendar'>
      <div className='calendar-header'>
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          moveToMonth={moveToMonth}
        />

        <div className='view-toggle'>
          <div
            className={`switch ${isWeekView ? 'on' : ''}`}
            onClick={showSelectedWeek}
          >
            <ListIcon />
          </div>
          <div
            className={`switch ${!isWeekView ? 'on' : ''}`}
            onClick={showFullMonth}
          >
            <CalendarIcon />
          </div>
        </div>
      </div>

      {typeof getSummary === 'function' && selectedDate && (
        <MonthlyAmount
          allTransactions={allTransactions}
          selectedDate={selectedDate}
          getSummary={getSummary}
        />
      )}

      <CalendarBody
        isWeekView={isWeekView}
        setIsWeekView={setIsWeekView}
        weekStartDate={weekStartDate}
        setWeekStartDate={setWeekStartDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentDate={currentDate}
        allTransactions={allTransactions}
        formatDateKey={formatDateKey}
        getSummary={getSummary}
        getStartOfWeek={getStartOfWeek}
        moveToMonth={moveToMonth}
      />

      {isWeekView && (
        <div className='transaction-section'>
          <div className='alert-CTA-banner'>
            <AlertRoundFillIcon className='alert-icon' />
            <div className='alert-text'>재평가 하지 않은 기록이 n건 있어요!</div>
            <ChevronRight className='left-icon' />
          </div>
          <TransactionHistory
            selectedDayTransactions={selectedDayTransactions}
          />
        </div>
      )}
      <GoExpense />
    </div>
  )
}

export default CalendarPage