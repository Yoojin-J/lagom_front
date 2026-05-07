import { useRef, useState } from 'react';
import ChevronLeftH from '../../../../assets/icons/common/ChevronLeft';
import Clover2 from '../../../../assets/Clover2.svg';
import Delite from '../../../../assets/icons/common/Delite';
import EditIcon from '../../../../assets/Edit.svg';
import FeedbackIcon from '../../../../assets/Feedback Icon.svg';
import {
  DEFAULT_BANK_NAME,
  GOAL_AMOUNT_MAX,
  GOAL_AMOUNT_MIN,
  GOAL_PERIOD_MAX,
  GOAL_PERIOD_MIN,
  MAX_NAME_LENGTH,
} from '../../constants/setup';
import DeleteBankModal from './DeleteBankModal';
import GoalAmountInput from './GoalAmountInput';
import GoalPeriodInput from './GoalPeriodInput';
import GoalTabSwitch from './GoalTabSwitch';
import SetupCompleteModal from './SetupCompleteModal';
import '../../styles/setup/BankSetupPage.css';

const SPECIAL_CHAR_REGEX = /[^가-힣a-zA-Z0-9\s]/;

function getInitialFormState(initialData) {
  if (!initialData) {
    return {
      bankName: DEFAULT_BANK_NAME,
      activeTab: 'amount',
      goalAmount: '',
      goalPeriod: '',
    };
  }

  return {
    bankName: initialData.name || DEFAULT_BANK_NAME,
    activeTab: initialData.goalType || 'amount',
    goalAmount: initialData.goalAmount ? String(initialData.goalAmount) : '',
    goalPeriod: initialData.goalPeriod ? String(initialData.goalPeriod) : '',
  };
}

function BankSetupPage({ mode = 'create', initialData, onComplete, onCompleteAndDeposit, onDelete, onBack }) {
  const initialFormState = getInitialFormState(initialData);
  const [bankName, setBankName] = useState(initialFormState.bankName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [activeTab, setActiveTab] = useState(initialFormState.activeTab);
  const [goalAmount, setGoalAmount] = useState(initialFormState.goalAmount);
  const [goalPeriod, setGoalPeriod] = useState(initialFormState.goalPeriod);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const inputRef = useRef(null);
  const isEditMode = mode === 'edit';

  const goalAmountNumber = Number(goalAmount);
  const goalPeriodNumber = Number(goalPeriod);
  const isAmountValid =
    goalAmount.length > 0 &&
    goalAmountNumber >= GOAL_AMOUNT_MIN &&
    goalAmountNumber <= GOAL_AMOUNT_MAX;
  const isPeriodValid =
    goalPeriod.length > 0 &&
    goalPeriodNumber >= GOAL_PERIOD_MIN &&
    goalPeriodNumber <= GOAL_PERIOD_MAX;

  const isValid =
    bankName.trim().length > 0 &&
    !nameError &&
    (activeTab === 'amount' ? isAmountValid : isPeriodValid);

  const submitPayload = {
    name: bankName.trim() || DEFAULT_BANK_NAME,
    goalType: activeTab,
    goalAmount,
    goalPeriod,
  };

  const handleEditStart = () => {
    setIsEditingName(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleNameChange = (event) => {
    const nextValue = event.target.value;

    if (SPECIAL_CHAR_REGEX.test(nextValue)) {
      setNameError(`특수문자를 제외하고 ${MAX_NAME_LENGTH}자 이하로 입력해주세요.`);
    } else {
      setNameError('');
    }

    setBankName(nextValue);
  };

  const handleNameBlur = () => {
    if (nameError) {
      return;
    }

    if (!bankName.trim()) {
      setBankName(DEFAULT_BANK_NAME);
    }

    setIsEditingName(false);
  };

  const handleNameClear = () => {
    setBankName('');
    setNameError('');
    inputRef.current?.focus();
  };

  const handleConfirm = () => {
    if (!isValid) {
      return;
    }

    if (isEditMode) {
      onComplete?.(submitPayload);
      return;
    }

    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    onComplete?.(submitPayload);
  };

  const handleModalDeposit = () => {
    setShowModal(false);
    onCompleteAndDeposit?.(submitPayload);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.();
  };

  return (
    <div className="bankSetupPage">
      <div className="bankSetupPage__header">
        <button
          className="bankSetupPage__backBtn"
          onClick={onBack}
          type="button"
          aria-label="뒤로가기"
        >
          <ChevronLeftH />
        </button>
        {isEditMode && (
          <button
            className="bankSetupPage__deleteBtn"
            onClick={() => setShowDeleteModal(true)}
            type="button"
          >
            삭제하기
          </button>
        )}
      </div>

      <div className="bankSetupPage__profile">
        <div className="bankSetupPage__avatar">
          <img src={Clover2} alt="" />
        </div>

        {isEditingName ? (
          <div className="bankSetupPage__nameEditArea">
            <div
              className={`bankSetupPage__nameInputRow ${
                nameError ? 'bankSetupPage__nameInputRow--error' : ''
              }`}
            >
              <input
                ref={inputRef}
                className="bankSetupPage__nameInput"
                value={bankName}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                maxLength={MAX_NAME_LENGTH}
                aria-label="통장 이름"
              />
              <div className="bankSetupPage__nameMeta">
                <span
                  className={`bankSetupPage__nameCount ${
                    nameError ? 'bankSetupPage__nameCount--error' : ''
                  }`}
                >
                  {bankName.length}/{MAX_NAME_LENGTH}
                </span>
                <button
                  className="bankSetupPage__iconButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleNameClear}
                  type="button"
                  aria-label="통장 이름 지우기"
                >
                  <Delite />
                </button>
              </div>
            </div>
            {nameError && (
              <p className="bankSetupPage__nameError">
                <img src={FeedbackIcon} alt="" />
                <span>{nameError}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="bankSetupPage__nameRow">
            <span className="bankSetupPage__nameText">{bankName}</span>
            <button
              className="bankSetupPage__editBtn"
              onClick={handleEditStart}
              type="button"
              aria-label="통장 이름 수정"
            >
              <img src={EditIcon} alt="" className="bankSetupPage__pencil" />
            </button>
          </div>
        )}
      </div>

      <div className="bankSetupPage__form">
        <GoalTabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'amount' ? (
          <GoalAmountInput value={goalAmount} onChange={setGoalAmount} />
        ) : (
          <GoalPeriodInput value={goalPeriod} onChange={setGoalPeriod} />
        )}
      </div>

      <button
        className={`bankSetupPage__confirmBtn ${isValid ? 'bankSetupPage__confirmBtn--active' : ''}`}
        onClick={handleConfirm}
        type="button"
      >
        확인
      </button>

      {!isEditMode && showModal && (
        <SetupCompleteModal
          bankName={bankName}
          onConfirm={handleModalConfirm}
          onDeposit={handleModalDeposit}
        />
      )}
      {showDeleteModal && (
        <DeleteBankModal
          bankName={bankName}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default BankSetupPage;
