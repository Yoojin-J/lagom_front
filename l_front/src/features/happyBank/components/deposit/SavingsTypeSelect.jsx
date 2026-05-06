import { useState, useRef, useEffect } from 'react';
import Disclosure from '../../../../assets/Disclosure.svg';
import Questionmark from '../../../../assets/Questionmark.svg';
import '../../styles/deposit/SavingsTypeSelect.css';

const OPTIONS = [
  { value: 'happy',  label: '행복저금',      description: '행복할 때 저금해요!' },
  { value: 'become', label: '행복해지는 저금', description: '소비 후 후회했을 때 저금해요!' },
];

/**
 * 저금 유형 선택 커스텀 드롭다운
 * @param {'happy'|'become'} value
 * @param {Function} onChange
 */
function SavingsTypeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="savingsTypeSelect" ref={wrapperRef}>
      <label className="savingsTypeSelect__label">입금유형</label>

      <div className="savingsTypeSelect__control">
        <button
          className="savingsTypeSelect__trigger"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="savingsTypeSelect__triggerLabel">{selected.label}</span>
          <span className="savingsTypeSelect__triggerDesc">{selected.description}</span>
        </button>
        <img
          className={`savingsTypeSelect__chevron ${isOpen ? 'savingsTypeSelect__chevron--open' : ''}`}
          src={Disclosure}
          alt=""
        />
        <div className="savingsTypeSelect__underline" />

        {isOpen && (
          <ul className="savingsTypeSelect__dropdown" role="listbox">
            {OPTIONS.map((opt) => (
              <li
                key={opt.value}
                className={`savingsTypeSelect__option ${opt.value === value ? 'savingsTypeSelect__option--selected' : ''}`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="savingsTypeSelect__optionLabel">{opt.label}</span>
                <img src={Questionmark} alt="" className="savingsTypeSelect__optionDescIcon" />
                <span className="savingsTypeSelect__optionDesc">{opt.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SavingsTypeSelect;
