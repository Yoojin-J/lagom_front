import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
// import testTransactions from '../../assets/data/expense3.json';
import testTransactions from '../../assets/data/expense4.json';
import testReEvaTransactions from '../../assets/data/expense5.json';
import ListIcon from '../../assets/icons/calendar/List.jsx';
import CalendarIcon from '../../assets/icons/calendar/Calendar.jsx';
import DatePicker from './components/DatePickerCalendar.jsx';
import MonthlyAmount from './components/MonthlyAmount.jsx';
import GoExpense from './components/GoExpense.jsx';
import './styles/CalendarPage.css';
import TransactionHistory from './components/TransactionHistory.jsx';
import CalendarBody from './components/CalendarBody.jsx';
import { useLedger } from './hook/useLedger.js';
import { formatDate } from './hook/dateUtil.js';
import { useExtendedRange } from './hook/useExtendedRange.js'
import AlertBanner from './components/AlertBanner.jsx';


const CalendarPage = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();
  const isFirstRender = useRef(true); // 새로고침(첫 렌더링)인지 확인용

  // 숫자로 변환 (값이 없을 경우를 대비해 현재 날짜를 초기값으로 설정)
  const currentYear = parseInt(year) || new Date().getFullYear();
  const currentMonth = parseInt(month) || new Date().getMonth() + 1;

  const { start, end } = useExtendedRange(currentYear, currentMonth);

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
  const { itemsByDate, totalIncome, totalExpense } = useLedger(rawData, currentMonth);

  // 백엔드에서 가져온 데이터 (오늘 기준 3일 이내, )
  const [reEvaData, setReEvaData] = useState([]);

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
  const fetchData = () => {
    try {
      // 5월 기록을 가져올 때 4월 마지막 주, 6월 첫째 주 기록도 같이 가져오기 위해 계산된 값을 보냄
      // 엔드포인트는 백에 따라 달라질 수 있음 
      // const res = axios.get('/api/ledger', { params: { start, end } })
      console.log("전체데이터불러오기");

      const res = testTransactions;
      setRawData(res);
      // console.log("testdata: ", testTransactions);
    } catch (error) {
      console.error("거래 데이터 불러오기 실패", error);
      setRawData([]);
    }
  };

  const fetchReevaluatedData = () => {
    try {
      // 오늘 기준으로 3일전까지의 내역 중 부정적 감정 + 높은 만족도 + is_reevaluated가 false인 값 가져오기, 프론트에서 보내는 값 없음
      // const res = axios.get('')
      const res = testReEvaTransactions;
      setReEvaData(res);
      console.log(res);
    } catch (error) {
      setReEvaData([]);
    }
  };


  useEffect(() => {
    // 컴포넌트가 처음 나타날 때(새로고침 포함) 실행
    if (isFirstRender.current) {
      const todayYear = currentDate.getFullYear();
      const todayMonth = currentDate.getMonth() + 1;

      // 현재 URL이 오늘 날짜와 다르다면 오늘 날짜로 강제 이동
      if (currentYear !== todayYear || currentMonth !== todayMonth) {
        navigate(`/calendar/${todayYear}/${String(todayMonth).padStart(2, '0')}`, { replace: true });
      }

      const initialWeekStart = getStartOfWeek(currentDate);
      setWeekStartDate(initialWeekStart);
      setSelectedDate(currentDate);

      isFirstRender.current = false;
      fetchReevaluatedData(); // 재평가해야되는 내역들
      console.log("마운트 시점에만 동작");
    }
  }, []); // '마운트 시점'에만 동작

  useEffect(() => {
    fetchData();   // 전체 데이터 불러오기
    console.log("itemsByDate: ", itemsByDate);
    console.log("달 수입, 지출", totalIncome, totalExpense);
    console.log("year, month, currentYear, currentMonth", year, month, currentYear, currentMonth);
  }, [start, end])  // 범위가 계산된 뒤에 불러오기

  useEffect(() => {
    // console.log("year, month, currentYear, currentMonth", year, month, currentYear, currentMonth);
    console.log("달 수입, 지출", totalIncome, totalExpense);
  }, [totalIncome, totalExpense])


  // useEffect(() => {
  //   console.log("itemsByDate: ", itemsByDate);
  //   console.log("selectedDayTransactions: ", selectedDayTransactions);
  // }, [itemsByDate, selectedDayTransactions]);

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

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;

    if (currentYear !== selectedYear || currentMonth !== selectedMonth) {
      navigate(`/calendar/${selectedYear}/${String(selectedMonth).padStart(2, '0')}`);
    }
  };


  return (
    <div className={`calendar ${isWeekView ? 'week' : 'month'}`}>
      <div className='calendar-header'>
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          moveToMonth={moveToMonth}
          currentYear={currentYear}
          currentMonth={currentMonth}
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
        currentYear={currentYear}
        currentMonth={currentMonth}
      />

      {isWeekView && (
        <div className='transaction-section'>
          {reEvaData.length !== 0 && 
            <AlertBanner 
              reEvaData={reEvaData}
            />
          }
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