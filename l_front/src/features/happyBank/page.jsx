import { useEffect, useState } from 'react';
import ChevronLeft from '../../assets/ChevronLeft.svg';
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

function BankDetailView({ bank, records, onBack, onSetup, onDeposit, onEdit, onComplete }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const happySavings = records.filter((record) => record.type === 'happy').reduce((sum, record) => sum + record.amount, 0);
  const becomeSavings = records.filter((record) => record.type === 'become').reduce((sum, record) => sum + record.amount, 0);
  const currentAmount = happySavings + becomeSavings;
  const enrichedBank = { ...bank, currentAmount, happySavings, becomeSavings };
  const isGoalReached = calcIsGoalReached(bank, currentAmount);

  useEffect(() => {
    if (isGoalReached) {
      setShowGoalModal(true);
    }
  }, [isGoalReached]);

  return (
    <div className="happyBankPage">
      <button className="happyBankPage__back" type="button" onClick={onBack}>
        <img src={ChevronLeft} alt="뒤로" />
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
          onConfirm={() => {
            setShowGoalModal(false);
            onComplete();
            onBack();
          }}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
}

function HappyBankPage({
  banks,
  hasBank,
  getRecords,
  initialBankId,
  onSetupOpen,
  onEditOpen,
  onDepositOpen,
  onComplete,
}) {
  const [currentView, setCurrentView] = useState('main');
  const [selectedBankId, setSelectedBankId] = useState(initialBankId ?? null);

  const localHappyBank = useHappyBank();
  const localSavingsRecords = useSavingsRecords();
  const localAchievements = useAchievements();

  const safeBanks = banks ?? localHappyBank.banks;
  const safeHasBank = hasBank ?? localHappyBank.hasBank;
  const safeGetRecords = getRecords ?? localSavingsRecords.getRecords;
  const selectedBank = safeBanks.find((bank) => bank.id === selectedBankId) ?? null;
  const useEmbeddedFlow = !onSetupOpen && !onEditOpen && !onDepositOpen && !onComplete;

  const openSetup = () => {
    if (useEmbeddedFlow) {
      setCurrentView('setup');
      return;
    }
    onSetupOpen?.();
  };

  const openEdit = (bankId) => {
    if (useEmbeddedFlow) {
      setSelectedBankId(bankId);
      setCurrentView('edit');
      return;
    }
    onEditOpen?.(bankId);
  };

  const openDeposit = (bankId) => {
    if (useEmbeddedFlow) {
      setSelectedBankId(bankId);
      setCurrentView('deposit');
      return;
    }
    onDepositOpen?.(bankId);
  };

  const handleCompleteInternal = (bankId) => {
    if (useEmbeddedFlow) {
      const bank = safeBanks.find((item) => item.id === bankId);
      localAchievements.addAchievement({
        bankInfo: bank,
        records: safeGetRecords(bankId),
      });
      localHappyBank.deleteBank(bankId);
      localSavingsRecords.resetRecords(bankId);
      return;
    }
    onComplete?.(bankId);
  };

  const handleSetupComplete = (bankData) => {
    localHappyBank.createBank(bankData);
    setCurrentView('main');
  };

  const handleSetupCompleteAndDeposit = (bankData) => {
    const bankId = localHappyBank.createBank(bankData);
    setSelectedBankId(bankId);
    setCurrentView('deposit');
  };

  const handleEditComplete = (bankData) => {
    localHappyBank.updateBank(selectedBankId, bankData);
    setCurrentView('main');
  };

  const handleDeleteBank = () => {
    localHappyBank.deleteBank(selectedBankId);
    setSelectedBankId(null);
    setCurrentView('main');
  };

  if (useEmbeddedFlow && (currentView === 'setup' || currentView === 'edit')) {
    return (
      <div className="happyBankPageOverlay">
        <BankSetupPage
          mode={currentView === 'edit' ? 'edit' : 'create'}
          initialData={selectedBank}
          onComplete={currentView === 'edit' ? handleEditComplete : handleSetupComplete}
          onCompleteAndDeposit={currentView === 'setup' ? handleSetupCompleteAndDeposit : undefined}
          onDelete={handleDeleteBank}
          onBack={() => setCurrentView('main')}
        />
      </div>
    );
  }

  if (useEmbeddedFlow && currentView === 'deposit') {
    return (
      <div className="happyBankPageOverlay">
        <DepositPage
          onComplete={() => setCurrentView('main')}
          onAddRecord={(record) => localSavingsRecords.addRecord(selectedBankId, record)}
          onBack={() => setCurrentView('main')}
          bankName={selectedBank?.name ?? '행복통장'}
        />
      </div>
    );
  }

  if (selectedBank) {
    return (
      <BankDetailView
        bank={selectedBank}
        records={safeGetRecords(selectedBank.id)}
        onBack={() => setSelectedBankId(null)}
        onSetup={openSetup}
        onDeposit={() => openDeposit(selectedBank.id)}
        onEdit={() => openEdit(selectedBank.id)}
        onComplete={() => {
          handleCompleteInternal(selectedBank.id);
          setSelectedBankId(null);
        }}
      />
    );
  }

  if (!safeHasBank) {
    return (
      <div className="happyBankPage">
        <BankStartCard onClick={openSetup} />
      </div>
    );
  }

  return (
    <div className="happyBankPage">
      {safeBanks.map((bank) => (
        <BankCard
          key={bank.id}
          bank={bank}
          records={safeGetRecords(bank.id)}
          onClick={() => setSelectedBankId(bank.id)}
        />
      ))}
      <AddBankButton onClick={openSetup} />
    </div>
  );
}

export default HappyBankPage;
