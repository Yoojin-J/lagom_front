import '../../styles/setup/BankNameInput.css';

/**
 * 통장 이름 입력 필드 (이름 + 연필 아이콘)
 * @param {string} value - 입력값
 * @param {Function} onChange - 변경 핸들러
 */
function BankNameInput({ value, onChange }) {
  return (
    <div className="bankNameInput">
      <label className="bankNameInput__label">통장 이름</label>
      <div className="bankNameInput__wrapper">
        <input
          className="bankNameInput__field"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="통장 이름을 입력하세요"
          maxLength={20}
        />
        <span className="bankNameInput__icon">✏️</span>
      </div>
    </div>
  );
}

export default BankNameInput;
