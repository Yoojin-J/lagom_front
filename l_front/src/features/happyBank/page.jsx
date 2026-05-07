import { useEffect, useState } from 'react';
import ChevronLeftH from '../../assets/icons/common/ChevronLeft';
import useAchievements from '../achievement/hooks/useAchievements';
import AddBankButton from './components/AddBankButton';
import BankCard from './components/BankCard';
import BankStartCard from './components/BankStartCard';
import BankSummaryCard from './components/BankSummaryCard';
import DepositPage from './components/deposit/DepositPage';
import EmptyBankState from './components/EmptyBankState';
import BankSetupPage from './components/setup/BankSetupPage';
import SavingsProgressPanel from './components/SavingsProgressPanel';
import SavingsRecordList from './components/SavingsRecordList';
import GoalAchievedModal from './components/detail/GoalAchievedModal';
import SavingsRecordModal from './components/detail/SavingsRecordModal';
import useHappyBank from './hooks/useHappyBank';
import useSavingsRecords from './hooks/useSavingsRecords';
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

// ── 통장 상세 뷰 ──────────────────────────────────
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
        <ChevronLeftH />
      </button>
      <BankSummaryCard bankInfo={enrichedBank} onDeposit={onDeposit} onEdit={onEdit} />
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
          <SavingsRecordList records={records} onRecordClick={setSelectedRecord} />
        </>
      )}
      {selectedRecord && (
        <SavingsRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
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

// ── 메인 페이지 ───────────────────────────────────
function HappyBankPage() {
  const { banks, hasBank, createBank, updateBank, deleteBank } = useHappyBank();
  const { addRecord, getRecords, resetRecords } = useSavingsRecords();
  const { addAchievement } = useAchievements();

  const [currentView, setCurrentView] = useState('main');
  const [selectedBankId, setSelectedBankId] = useState(null);

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? null;

  const handleComplete = (bankId) => {
    const bank = banks.find((b) => b.id === bankId);
    addAchievement({ bankInfo: bank, records: getRecords(bankId) });
    deleteBank(bankId);
    resetRecords(bankId);
  };

  // 통장 개설 / 수정
  if (currentView === 'setup' || currentView === 'edit') {
    return (
      <div className="happyBankPageOverlay">
        <BankSetupPage
          mode={currentView === 'edit' ? 'edit' : 'create'}
          initialData={selectedBank}
          onComplete={(bankData) => {
            if (currentView === 'edit') updateBank(selectedBankId, bankData);
            else createBank(bankData);
            setCurrentView('main');
          }}
          onCompleteAndDeposit={currentView === 'setup' ? (bankData) => {
            const bankId = createBank(bankData);
            setSelectedBankId(bankId);
            setCurrentView('deposit');
          } : undefined}
          onDelete={() => {
            deleteBank(selectedBankId);
            setSelectedBankId(null);
            setCurrentView('main');
          }}
          onBack={() => setCurrentView('main')}
        />
      </div>
    );
  }

  // 저금하기
  if (currentView === 'deposit') {
    return (
      <div className="happyBankPageOverlay">
        <DepositPage
          bankName={selectedBank?.name ?? '행복통장'}
          onAddRecord={(record) => addRecord(selectedBankId, record)}
          onComplete={() => setCurrentView('detail')}
          onBack={() => setCurrentView('detail')}
        />
      </div>
    );
  }

  // 통장 상세
  if (currentView === 'detail' && selectedBank) {
    return (
      <BankDetailView
        bank={selectedBank}
        records={getRecords(selectedBankId)}
        onBack={() => { setSelectedBankId(null); setCurrentView('main'); }}
        onSetup={() => setCurrentView('setup')}
        onDeposit={() => setCurrentView('deposit')}
        onEdit={() => setCurrentView('edit')}
        onComplete={() => { handleComplete(selectedBankId); setSelectedBankId(null); setCurrentView('main'); }}
      />
    );
  }

  // 통장 없음
  if (!hasBank) {
    return (
      <div className="happyBankPage">
        <BankStartCard onClick={() => setCurrentView('setup')} />
      </div>
    );
  }

  // 통장 목록
  return (
    <div className="happyBankPage">
      {banks.map((bank) => (
        <BankCard
          key={bank.id}
          bank={bank}
          records={getRecords(bank.id)}
          onClick={() => { setSelectedBankId(bank.id); setCurrentView('detail'); }}
        />
      ))}
      <AddBankButton onClick={() => setCurrentView('setup')} />
    </div>
  );
}

export default HappyBankPage;
