import '../../styles/setup/GoalTabSwitch.css';

/**
 * 목표금액 / 목표기간 탭 전환
 * @param {'amount'|'period'} activeTab - 현재 활성 탭
 * @param {Function} onTabChange - 탭 변경 핸들러
 */
function GoalTabSwitch({ activeTab, onTabChange }) {
  return (
    <div className="goalTabSwitch">
      <div className={`goalTabSwitch__slider ${activeTab === 'period' ? 'goalTabSwitch__slider--period' : ''}`} />
      <button
        className={`goalTabSwitch__tab ${activeTab === 'amount' ? 'goalTabSwitch__tab--active' : ''}`}
        onClick={() => onTabChange('amount')}
        type="button"
      >
        목표 금액
      </button>
      <button
        className={`goalTabSwitch__tab ${activeTab === 'period' ? 'goalTabSwitch__tab--active' : ''}`}
        onClick={() => onTabChange('period')}
        type="button"
      >
        목표 기간
      </button>
    </div>
  );
}

export default GoalTabSwitch;
