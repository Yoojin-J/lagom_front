import '../styles/DatePickerCalendar.css';
import React, { useRef, forwardRef } from 'react'
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { getYear } from 'date-fns';
import ChevronLeft from '../../../assets/icons/common/ChevronLeft';
import ChevronRight from '../../../assets/icons/common/ChevronRight';
import DisClosure from '../../../assets/icons/common/DisClosure';

const DatePickerCalendar = ({
  selectedDate,
  moveToMonth
}) => {

  const datePickerRef = useRef(null);


  // datePicker input 커스텀
  const CustomInput = forwardRef(({ value, onClick }, ref) =>
    <div className='custom-input' onClick={onClick} ref={ref}>
      {value} <span className='disclosure'><DisClosure /></span>
    </div>
  );


  const CustomHeader = ({
    date,
    changeYear,
  }) => {
    const currentYear = getYear(date);

    return (
      <div className='header'>
        <div
          onClick={() => changeYear(currentYear - 1)}   // ← 1년 전
        >
          <ChevronLeft />
        </div>

        <div>
          {currentYear}
        </div>

        <div
          onClick={() => changeYear(currentYear + 1)}   // ← 1년 후
        >
          <ChevronRight />
        </div>
      </div>
    );
  };


  return (
    <div>
      <DatePicker
        locale={ko}
        ref={datePickerRef}
        selected={selectedDate}
        onChange={(date) => {
          const month = date.getMonth() + 1;
          const currentMonth = selectedDate.getMonth() + 1;

          if (month !== currentMonth) { moveToMonth(date) };
        }}
        dateFormat={"yyyy년 MM월"}
        showMonthYearPicker
        popperPlacement='bottom-start'
        showPopperArrow={false}
        renderCustomHeader={CustomHeader}
        customInput={<CustomInput />}
        popperClassName="date-picker-popper"
        wrapperClassName="date-picker-wrapper"
      />
    </div>
  )

}

export default DatePickerCalendar