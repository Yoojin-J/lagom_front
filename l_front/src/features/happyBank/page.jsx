import { useState, useEffect } from 'react';
import ChevronLeft from '../../assets/ChevronLeft.svg';
import BankStartCard from './components/BankStartCard';
import AddBankButton from './components/AddBankButton';
import BankCard from './components/BankCard';
import BankSummaryCard from './components/BankSummaryCard';
import SavingsProgressPanel from './components/SavingsProgressPanel';
import SavingsRecordList from './components/SavingsRecordList';
import EmptyBankState from './components/EmptyBankState';
import SavingsRecordModal from './components/detail/SavingsRecordModal';
import GoalAchievedModal from './components/detail/GoalAchievedModal';
import './styles/page.css';

function calcIsGoalReached(bank, currentAmount) {
  const { goalType, goalAmount, goalPeriod, startDate } = bank;
  if (goalType === 'amount') {
    return currentAmount >= (goalAmount ?? 0) && (goalAmount ?? 0) > 0;
  }
  const start = new Date(startDate.replace(/\./g, '-'));
  const daysElapsed = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  return daysElapsed >= goalPeriod * 30;
}

// ── 개별 통장 상세 뷰 ──────────────────────────────
function BankDetailView({ bank, records, onBack, onSetup, onDeposit, onEdit, onComplete }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const happySavings = records.filter((r) => r.type === 'happy').reduce((s, r) => s + r.amount, 0);
  const becomeSavings = records.filter((r) => r.type === 'become').reduce((s, r) => s + r.amount, 0);
  const currentAmount = happySavings + becomeSavings;
  const enrichedBank = { ...bank, currentAmount, happySavings, becomeSavings };
  const isGoalReached = calcIsGoalReached(bank, currentAmount);

  useEffect(() => {
    if (isGoalReached) setShowGoalModal(true);
  }, [isGoalReached]);

  return (
    <div className="happyBankPage">
      <button className="happyBankPage__back" type="button" onClick={onBack}>
        <img src={ChevronLeft} alt="뒤로" />
      </button>
      <BankSummaryCard
        bankInfo={enrichedBank}
        onDeposit={onDeposit}
        onEdit={onEdit}
      />
      {records.length === 0 ? (
        <EmptyBankState onSetup={onSetup} onDeposit={onDeposit} />
      ) : (
        <>
          <SavingsProgressPanel
            happySavings={happySavings}
            becomeSavings={becomeSavings}
            goalAmount={bank.goalAmount}
            goalType={bank.goalType}
          />
          <SavingsRecordList
            records={records}
            onRecordClick={setSelectedRecord}
          />
        </>
      )}
      {selectedRecord && (
        <SavingsRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
      {showGoalModal && (
        <GoalAchievedModal
          bankName={bank.name}
          onConfirm={() => { setShowGoalModal(false); onComplete(); onBack(); }}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
}

// ── 메인 페이지 ────────────────────────────────────
function HappyBankPage({ banks, hasBank, getRecords, initialBankId, onSetupOpen, onEditOpen, onDepositOpen, onComplete }) {
  const [selectedBankId, setSelectedBankId] = useState(initialBankId ?? null);

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? null;

  // 통장 상세 뷰
  if (selectedBank) {
    return (
      <BankDetailView
        bank={selectedBank}
        records={getRecords(selectedBank.id)}
        onBack={() => setSelectedBankId(null)}
        onSetup={onSetupOpen}
        onDeposit={() => onDepositOpen(selectedBank.id)}
        onEdit={() => onEditOpen(selectedBank.id)}
        onComplete={() => { onComplete(selectedBank.id); setSelectedBankId(null); }}
      />
    );
  }

  // 통장 없음
  if (!hasBank) {
    return (
      <div className="happyBankPage">
        <BankStartCard onClick={onSetupOpen} />
      </div>
    );
  }

  // 통장 목록 뷰
  return (
    <div className="happyBankPage">
      {banks.map((bank) => (
        <BankCard
          key={bank.id}
          bank={bank}
          records={getRecords(bank.id)}
          onClick={() => setSelectedBankId(bank.id)}
        />
      ))}
      <AddBankButton onClick={onSetupOpen} />
    </div>
  );
}

export default HappyBankPage;
