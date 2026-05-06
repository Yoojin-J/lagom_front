import AddBankButton from './AddBankButton';
import '../styles/EmptyBankState.css';

function EmptyBankState({ onSetup, onDeposit }) {
  return (
    <div className="emptyBankState">
      <AddBankButton onClick={onSetup ?? onDeposit} />

      <div className="emptyBankState__content">
        <span className="emptyBankState__clover" aria-hidden="true" />
        <p className="emptyBankState__message">첫 행복의 순간을 기록해보세요!</p>
      </div>
    </div>
  );
}

export default EmptyBankState;
