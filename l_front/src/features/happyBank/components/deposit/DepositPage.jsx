import { useState } from 'react';
import SavingsTypeSelect from './SavingsTypeSelect';
import AmountInput from './AmountInput';
import MemoInput from './MemoInput';
import HashtagInput from './HashtagInput';
import useDeposit from '../../hooks/useDeposit';
import Clover2 from '../../../../assets/Clover2.svg';
import ChevronLeft from '../../../../assets/ChevronLeft.svg';
import '../../styles/deposit/DepositPage.css';

/**
 * 저금하기 페이지 레이아웃
 * @param {Function} onComplete - 저금 완료 후 콜백
 * @param {Function} onAddRecord - 기록 추가 콜백
 * @param {Function} onBack - 뒤로가기 콜백
 * @param {string} bankName - 통장 이름
 */
function DepositPage({ onComplete, onAddRecord, onBack, bankName = '행복통장' }) {
  const [type, setType] = useState('happy');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [tags, setTags] = useState([]);
  const { isLoading, handleSubmit } = useDeposit();

  const isValid = amount.length > 0 && memo.trim().length > 0;

  const onSubmit = async () => {
    if (!isValid) return;
    const hashtag = tags.map((t) => `#${t}`).join(' ');
    const record = {
      id: Date.now(),
      type,
      amount: Number(amount),
      memo,
      hashtag,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    };
    await handleSubmit(record);
    onAddRecord?.(record);
    onComplete?.();
  };

  return (
    <div className="depositPage">
      <div className="depositPage__header">
        <button className="depositPage__backBtn" onClick={onBack} type="button" aria-label="뒤로가기">
          <img src={ChevronLeft} alt="뒤로" />
        </button>
      </div>

      <div className="depositPage__profile">
        <div className="depositPage__avatar">
          <img src={Clover2} alt="" />
        </div>
        <span className="depositPage__bankName">{bankName}</span>
      </div>

      <div className="depositPage__form">
        <SavingsTypeSelect value={type} onChange={setType} />
        <AmountInput value={amount} onChange={setAmount} />
        <MemoInput value={memo} onChange={setMemo} />
        <HashtagInput tags={tags} onChange={setTags} />
      </div>

      <button
        className={`depositPage__submitBtn ${isValid ? 'depositPage__submitBtn--active' : ''}`}
        onClick={onSubmit}
        disabled={!isValid || isLoading}
      >
        {isLoading ? '저금 중...' : '확인'}
      </button>
    </div>
  );
}

export default DepositPage;
