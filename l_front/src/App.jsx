import { useState } from 'react'
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import HappyBankPage from './features/happyBank/page'
import BankSetupPage from './features/happyBank/components/setup/BankSetupPage'
import DepositPage from './features/happyBank/components/deposit/DepositPage'
import AchievementPage from './features/achievement/page'
import useHappyBank from './features/happyBank/hooks/useHappyBank'
import useSavingsRecords from './features/happyBank/hooks/useSavingsRecords'
import useAchievements from './features/achievement/hooks/useAchievements'

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentView, setCurrentView] = useState('main');
  const [selectedBankId, setSelectedBankId] = useState(null);

  const { banks, hasBank, createBank, updateBank, deleteBank } = useHappyBank();
  const { addRecord, getRecords, resetRecords } = useSavingsRecords();
  const { achievements, addAchievement } = useAchievements();

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? null;

  const handleSetupComplete = (bankData) => {
    createBank(bankData);
    setCurrentView('main');
  };

  const handleSetupCompleteAndDeposit = (bankData) => {
    const bankId = createBank(bankData);
    setSelectedBankId(bankId);
    setCurrentView('deposit');
  };

  const handleEditComplete = (bankData) => {
    updateBank(selectedBankId, bankData);
    setCurrentView('main');
  };

  const handleDeleteBank = () => {
    deleteBank(selectedBankId);
    setCurrentView('main');
  };

  const handleComplete = (bankId) => {
    const bank = banks.find((b) => b.id === bankId);
    addAchievement({ bankInfo: bank, records: getRecords(bankId) });
    deleteBank(bankId);
    resetRecords(bankId);
  };

  if (currentView === 'setup' || currentView === 'edit') {
    return (
      <div className='app_content'>
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

  if (currentView === 'deposit') {
    return (
      <div className='app_content'>
        <DepositPage
          onComplete={() => setCurrentView('main')}
          onAddRecord={(record) => addRecord(selectedBankId, record)}
          onBack={() => setCurrentView('main')}
          bankName={selectedBank?.name ?? '행복통장'}
        />
      </div>
    );
  }

  return (
    <div className='app_content'>
      <Header />
      <NavigationBar onTabChange={setActiveTab} initialTab={activeTab} />
      {activeTab === 1 && (
        <HappyBankPage
          banks={banks}
          hasBank={hasBank}
          getRecords={getRecords}
          initialBankId={selectedBankId}
          onSetupOpen={() => { setSelectedBankId(null); setCurrentView('setup'); }}
          onEditOpen={(bankId) => { setSelectedBankId(bankId); setCurrentView('edit'); }}
          onDepositOpen={(bankId) => { setSelectedBankId(bankId); setCurrentView('deposit'); }}
          onComplete={handleComplete}
        />
      )}
      {activeTab === 3 && (
        <AchievementPage achievements={achievements} />
      )}
    </div>
  )
}

export default App
