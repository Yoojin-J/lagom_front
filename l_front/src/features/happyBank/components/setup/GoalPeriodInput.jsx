import { useState, useRef, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { getMonth, getYear } from 'date-fns';
import ChevronLeft from '../../../../assets/icons/common/ChevronLeft';
import ChevronRight from '../../../../assets/icons/common/ChevronRight';
import DisClosure from '../../../../assets/icons/common/DisClosure';
import '../../../expense/styles/ExpensePage.css';
import '../../styles/setup/GoalPeriodInput.css';

const toDate = (v) => (v ? new Date(v.replace(/\./g, '-')) : null);
const toStoreFormat = (date) =>
  date ? date.toISOString().slice(0, 10).replace(/-/g, '.') : '';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className={`custom-input ${value ? '' : 'none'}`} onClick={onClick} ref={ref}>
    {value || placeholder}
    <div className="disclosure"><DisClosure fill="#E6E8EA" /></div>
  </div>
));

const CustomHeader = ({ date, changeMonth }) => {
  const currentYear = getYear(date);
  const currentMonth = getMonth(date);
  return (
    <div className="header">
      <div onClick={() => changeMonth(currentMonth - 1)}>
        <ChevronLeft stroke="#75C0D1" />
      </div>
      <div>{currentYear} . {currentMonth + 1}</div>
      <div onClick={() => changeMonth(currentMonth + 1)}>
        <ChevronRight stroke="#75C0D1" />
      </div>
    </div>
  );
};

function GoalPeriodInput({ value, onChange }) {
  const datePickerRef = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);

  const [tempDate, setTempDate] = useState(toDate(value));
  const isInvalid = value && toDate(value) <= today;

  const handleConfirm = () => {
    onChange(toStoreFormat(tempDate));
    datePickerRef.current?.setOpen(false);
  };

  const handleCancel = () => {
    setTempDate(toDate(value));
    datePickerRef.current?.setOpen(false);
  };

  return (
    <div className="goalPeriodInput">
      <label className="goalPeriodInput__label">만기일</label>
      <div className={`goalPeriodInput__wrapper ${isInvalid ? 'goalPeriodInput__wrapper--error' : ''}`}>
        <DatePicker
          locale={ko}
          ref={datePickerRef}
          selected={tempDate}
          onChange={(date) => setTempDate(date)}
          dateFormat="yyyy년 MM월 dd일"
          minDate={tomorrow}
          placeholderText="년/월/일"
          popperPlacement="auto"
          showPopperArrow={false}
          shouldCloseOnSelect={false}
          fixedHeight={false}
          popperProps={{ strategy: 'fixed' }}
          popperClassName="date-picker-popper"
          wrapperClassName="date-picker-wrapper"
          renderCustomHeader={CustomHeader}
          customInput={<CustomInput />}
        >
          <div className="devider" />
          <div className="btn-content">
            <button type="button" className="cancle" onClick={handleCancel}>취소</button>
            <button type="button" className="confirm" onClick={handleConfirm}>확인</button>
          </div>
        </DatePicker>
        <div className="goalPeriodInput__underline" />
      </div>
      {isInvalid && (
        <p className="goalPeriodInput__message goalPeriodInput__message--error">
          오늘 이후 날짜로 설정해주세요.
        </p>
      )}
    </div>
  );
}

export default GoalPeriodInput;
