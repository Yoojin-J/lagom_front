import { useState } from 'react';
import BankStartCard from './components/BankStartCard';
import BankSummaryCard from './components/BankSummaryCard';
import SavingsProgressPanel from './components/SavingsProgressPanel';
import SavingsRecordList from './components/SavingsRecordList';
import EmptyBankState from './components/EmptyBankState';
import SavingsRecordModal from './components/detail/SavingsRecordModal';
import BankSetupPage from './components/setup/BankSetupPage';
import useHappyBank from './hooks/useHappyBank';
import useSavingsRecords from './hooks/useSavingsRecords';
import './styles/page.css';

// 현재 표시할 화면
// 'main'  : 행복통장 메인 (미개설 카드 or 통장 정보)
// 'setup' : 통장 개설 플로우
// 'deposit': 저금하기 플로우 (TODO)
function HappyBankPage() {
  const { bankInfo, hasBank, createBank } = useHappyBank();
  const { records } = useSavingsRecords();
  const [currentView, setCurrentView] = useState('main');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSetupComplete = (bankData) => {
    createBank(bankData);
    setCurrentView('main');
  };

  if (currentView === 'setup') {
    return (
      <BankSetupPage
        onComplete={handleSetupComplete}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // 통장 미개설 상태
  if (!hasBank) {
    return (
      <div className="happyBankPage">
        <BankStartCard onClick={() => setCurrentView('setup')} />
      </div>
    );
  }

  // 통장 개설 후 메인 화면
  return (
    <div className="happyBankPage">
      <BankSummaryCard
        bankInfo={bankInfo}
        onDeposit={() => setCurrentView('deposit')}
        onSetup={() => setCurrentView('setup')}
      />
      <SavingsProgressPanel
        happySavings={bankInfo.happySavings}
        becomeSavings={bankInfo.becomeSavings}
        goalAmount={bankInfo.goalAmount}
      />
      {records.length === 0 ? (
        <EmptyBankState />
      ) : (
        <SavingsRecordList
          records={records}
          onRecordClick={(record) => setSelectedRecord(record)}
        />
      )}
      {selectedRecord && (
        <SavingsRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}

export default HappyBankPage;
