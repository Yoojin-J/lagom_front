import { useRef, useState } from 'react';
import '../../styles/setup/GoalPeriodInput.css';
import Delite from '../../../../assets/icons/common/Delite';
import Feedback from '../../../../assets/icons/common/Feedback';
import { GOAL_PERIOD_MAX, GOAL_PERIOD_MIN } from '../../constants/setup';

const PERIOD_GUIDE_TEXT = '1개월부터 36개월까지 저금할 수 있어요';

function GoalPeriodInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasTouched, setHasTouched] = useState(false);
  const inputRef = useRef(null);

  const numericValue = Number(value);
  const hasValue = value.length > 0;
  const isInvalid =
    hasValue &&
    (numericValue < GOAL_PERIOD_MIN || numericValue > GOAL_PERIOD_MAX);
  const showError = hasTouched && hasValue && isInvalid;
  const showHint = isFocused && !showError;

  const handleChange = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    onChange(numeric);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasTouched(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasTouched(true);
  };

  const handleClear = () => {
    onChange('');
    setHasTouched(true);
    inputRef.current?.focus();
  };

  return (
    <div className="goalPeriodInput">
      <label className="goalPeriodInput__label">목표기간</label>
      <div
        className={`goalPeriodInput__wrapper ${
          isFocused ? 'goalPeriodInput__wrapper--focused' : ''
        } ${showError ? 'goalPeriodInput__wrapper--error' : ''}`}
      >
        <div className="goalPeriodInput__fieldRow">
          <input
            ref={inputRef}
            className="goalPeriodInput__field"
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="0"
            aria-label="목표 기간"
          />
          <span className="goalPeriodInput__unit">개월</span>
          {isFocused && hasValue && (
            <button
              className="goalPeriodInput__clear"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              type="button"
              aria-label="목표 기간 지우기"
            >
              <Delite />
            </button>
          )}
        </div>
        <div className="goalPeriodInput__underline" />
      </div>

      {showError ? (
        <p className="goalPeriodInput__message goalPeriodInput__message--error">
           <Feedback />
          <span>{PERIOD_GUIDE_TEXT}</span>
        </p>
      ) : (
        showHint && <p className="goalPeriodInput__message">{PERIOD_GUIDE_TEXT}</p>
      )}
    </div>
  );
}

export default GoalPeriodInput;
