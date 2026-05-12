import { useRef } from 'react';
import '../../styles/setup/GoalPeriodInput.css';
import Delite from '../../../../assets/icons/common/Delite';
import DisClosure from '../../../../assets/icons/common/DisClosure';

const toInputFormat = (v) => (v ? v.replace(/\./g, '-') : '');
const toStoreFormat = (v) => (v ? v.replace(/-/g, '.') : '');

function GoalPeriodInput({ value, onChange }) {
  const inputRef = useRef(null);

  const today = new Date().toISOString().slice(0, 10);
  const hasValue = !!value;
  const isInvalid = hasValue && toInputFormat(value) <= today;

  const handleChange = (e) => {
    onChange(toStoreFormat(e.target.value));
  };

  const handleClear = () => {
    onChange('');
  };

  const handleClick = () => {
    inputRef.current?.showPicker?.();
  };

  const formatDisplay = (v) => {
    if (!v) return '';
    return v.replace(/\./g, '/');
  };

  return (
    <div className="goalPeriodInput">
      <label className="goalPeriodInput__label">만기일</label>
      <div className={`goalPeriodInput__wrapper ${isInvalid ? 'goalPeriodInput__wrapper--error' : ''}`}>
        <div className="goalPeriodInput__fieldRow">
          <div className="goalPeriodInput__display" onClick={handleClick}>
            {hasValue ? (
              <span className="goalPeriodInput__value">{formatDisplay(value)}</span>
            ) : (
              <span className="goalPeriodInput__placeholder">년/월/일</span>
            )}
            <input
              ref={inputRef}
              className="goalPeriodInput__hiddenInput"
              type="date"
              value={toInputFormat(value)}
              min={today}
              onChange={handleChange}
              aria-label="만기일"
            />
          </div>
          {hasValue ? (
            <button
              className="goalPeriodInput__clear"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              type="button"
              aria-label="만기일 지우기"
            >
              <Delite />
            </button>
          ) : (
            <span className="goalPeriodInput__chevron" onClick={handleClick}>
              <DisClosure />
            </span>
          )}
        </div>
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
