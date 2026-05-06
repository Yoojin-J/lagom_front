import Symbol from '../../../assets/Symbol.svg';
import '../styles/AddBankButton.css';

function AddBankButton({ onClick }) {
  return (
    <button className="addBankButton" type="button" onClick={onClick}>
      <span className="addBankButton__iconWrap">
        <img
          src={Symbol}
          alt=""
          className="addBankButton__icon"
        />
      </span>
      통장 개설하기
    </button>
  );
}

export default AddBankButton;
