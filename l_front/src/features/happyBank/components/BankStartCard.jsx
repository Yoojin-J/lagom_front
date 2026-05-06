import '../styles/BankStartCard.css';
import Clover2 from "../../../assets/Clover2.svg";
import ChevronIcon from "../../../assets/ChevronIcon.svg";

/**
 * 행복통장 미개설 상태 진입 카드
 * @param {Function} onClick - 카드 클릭 시 통장 개설 페이지로 이동
 */
function BankStartCard({ onClick }) {
  return (
    <div className="bankStartCard" onClick={onClick}>
      <div className="bankStartCard__avatar">
        <img src={Clover2} alt="clover" />
      </div>
      <div className="bankStartCard__text">
        <span className="bankStartCard__sub">행복해지고 싶다면?</span>
        <span className="bankStartCard__title">행복저금 시작하기</span>
      </div>
      <span className="bankStartCard__arrow">
        <img src={ChevronIcon} alt="chevron" />
      </span>
    </div>
  );
}

export default BankStartCard;
