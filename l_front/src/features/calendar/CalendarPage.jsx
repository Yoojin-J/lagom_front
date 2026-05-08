import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
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
import { useLedger } from './hook/useLedger.js';
import { formatDate } from './hook/dateUtil.js';


const CalendarPage = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();

  const currentDate = new Date(); //오늘
  const [selectedDate, setSelectedDate] = useState(new Date); // 선택된 날짜

  const [isWeekView, setIsWeekView] = useState(true); // 주간달력인가요? true 디폴트

  const [weekStartDate, setWeekStartDate] = useState(null); // 한 주의 시작 날짜 구하기(월요일 날짜)

  // 선택한 날짜의 거래 목록
  const [selectedDayTransactions, setSelectedDayTransactions] = useState({
    dayItems: [],
    dayIncome: 0,
    dayExpense: 0
  });
  // 백엔드에서 가져온 데이터
  const [rawData, setRawData] = useState([]);
  // 가공된 데이터 가져오기
  const { itemsByDate, totalIncome, totalExpense } = useLedger(rawData);

  // 한 주의 시작 날짜 가져오기 함수
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // 전체 거래 데이터 불러오기 (한 번만 실행)
  const fetchAllTransactions = () => {
    try {
      const res = testTransactions;
      setRawData(res);
      console.log("testdata: ", testTransactions);
    } catch (error) {
      console.error("거래 데이터 불러오기 실패", error);
      setRawData([]);
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    const initialWeekStart = getStartOfWeek(currentDate);
    setWeekStartDate(initialWeekStart);
    setSelectedDate(currentDate);
    fetchAllTransactions();   // 전체 데이터 불러오기
  }, []);

  useEffect(() => {
    console.log("itemsByDate: ", itemsByDate);
    console.log("selectedDayTransactions: ", selectedDayTransactions);
  }, [itemsByDate, selectedDayTransactions]);

  // 선택한 날짜 변경 시 해당 날짜 거래 내역 필터링
  useEffect(() => {
    const dateKey = formatDate(selectedDate);
    const filtered = itemsByDate[dateKey] || { dayItems: [], dayIncome: 0, dayExpense: 0 };
    setSelectedDayTransactions(filtered);

  }, [selectedDate, itemsByDate]);



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


  return (
    <div className={`calendar ${isWeekView ? 'week' : 'month'}`}>
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


      <MonthlyAmount
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />


      <CalendarBody
        isWeekView={isWeekView}
        setIsWeekView={setIsWeekView}
        weekStartDate={weekStartDate}
        setWeekStartDate={setWeekStartDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentDate={currentDate}
        getStartOfWeek={getStartOfWeek}
        moveToMonth={moveToMonth}
        itemsByDate={itemsByDate}
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