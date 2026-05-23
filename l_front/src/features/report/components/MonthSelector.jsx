import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { getYear } from 'date-fns';
import ChevronLeft from '../../../assets/icons/common/ChevronLeft';
import ChevronRight from '../../../assets/icons/common/ChevronRight';
import DisClosure from '../../../assets/icons/common/DisClosure';
import '../styles/MonthYearPicker.css';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className="custom-input" onClick={onClick} ref={ref}>
    {value} <span className="disclosure"><DisClosure /></span>
  </div>
));

const CustomHeader = ({ date, changeYear }) => {
  const currentYear = getYear(date);
  return (
    <div className="header">
      <div onClick={() => changeYear(currentYear - 1)}>
        <ChevronLeft stroke="#75C0D1" />
      </div>
      <div>{currentYear}</div>
      <div onClick={() => changeYear(currentYear + 1)}>
        <ChevronRight stroke="#75C0D1" />
      </div>
    </div>
  );
};

function MonthSelector({ selectedDate, onChange }) {
  return (
    <DatePicker
      locale={ko}
      selected={selectedDate}
      onChange={onChange}
      dateFormat="yyyy년 M월"
      showMonthYearPicker
      popperPlacement="bottom-start"
      showPopperArrow={false}
      renderCustomHeader={CustomHeader}
      customInput={<CustomInput />}
      popperClassName="date-picker-popper"
      wrapperClassName="date-picker-wrapper"
    />
  );
}

export default MonthSelector;
