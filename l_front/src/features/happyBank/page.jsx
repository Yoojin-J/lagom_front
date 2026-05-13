import { useEffect, useRef, useState } from 'react';
import useAchievements from '../achievement/hooks/useAchievements';
import AddBankButton from './components/AddBankButton';
import BankStartCard from './components/BankStartCard';
import BankSummaryCard from './components/BankSummaryCard';
import DepositPage from './components/deposit/DepositPage';
import WithdrawPage from './components/withdraw/WithdrawPage';
import WithdrawEmptyModal from './components/withdraw/WithdrawEmptyModal';
import EmptyBankState from './components/EmptyBankState';
import BankSetupPage from './components/setup/BankSetupPage';
import SavingsProgressPanel from './components/SavingsProgressPanel';
import SavingsRecordList from './components/SavingsRecordList';
import GoalAchievedModal from './components/detail/GoalAchievedModal';
import SavingsRecordModal from './components/detail/SavingsRecordModal';
import useHappyBank from './hooks/useHappyBank';
import useSavingsRecords from './hooks/useSavingsRecords';
import './styles/page.css';

// 목표 달성 여부 판단
// - 목표 금액: 현재 저금액이 목표 금액 이상이면 달성
// - 목표 기간: 오늘이 만기일 이후면 달성
function calcIsGoalReached(bank, currentAmount) {
  const { goalType, goalAmount, goalDate } = bank;
  if (goalType === 'amount') {
    return currentAmount >= (goalAmount ?? 0) && (goalAmount ?? 0) > 0;
  }
  return goalDate ? new Date() >= new Date(goalDate.replace(/\./g, '-')) : false;
}

// 통장 상세 뷰 
// 통장 상세 화면에서만 사용하는 서브 컴포넌트
// 기록 합산, 목표 달성 감지 등 상세 화면 전용 로직을 분리해 page.jsx 복잡도를 낮춤
function BankDetailView({ bank, records, onBack, onDeposit, onWithdraw, onEdit, onComplete }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const happySavings = records.filter((r) => r.type === 'happy').reduce((s, r) => s + r.amount, 0);
  const becomeSavings = records.filter((r) => r.type === 'become').reduce((s, r) => s + r.amount, 0);
  const currentAmount = happySavings + becomeSavings;
  // SavingsProgressPanel에 행복저금/행복해지는저금 금액도 같이 넘겨야 해서 bank 객체를 확장
  const enrichedBank = { ...bank, currentAmount, happySavings, becomeSavings };
  const isGoalReached = calcIsGoalReached(bank, currentAmount);

  // 목표 달성 시 모달을 자동으로 띄움
  // 기록이 추가될 때마다 isGoalReached가 재계산되어 실시간으로 감지됨
  useEffect(() => {
    if (isGoalReached) setShowGoalModal(true);
  }, [isGoalReached]);

  // 브라우저 뒤로가기와 state 내비게이션 연결
  // 마운트 시 history 항목 추가 → 뒤로가기 누르면 onBack 호출
  const onBackRef = useRef(onBack);
  useEffect(() => { onBackRef.current = onBack; }, [onBack]);
  useEffect(() => {
    window.history.pushState(null, '');
    const handler = () => onBackRef.current?.();
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return (
    <div className="happyBankPage">
      <BankSummaryCard bankInfo={enrichedBank} onDeposit={onDeposit} onWithdraw={onWithdraw} onEdit={onEdit} />
      {records.length === 0 ? (
        <EmptyBankState />
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

// 메인 페이지
// 화면 전환은 react-router 대신 currentView 상태로 관리
// 이유: 행복통장 내 화면들이 모두 /happyBank 경로 안에서 동작하므로 URL 변경 없이 뷰만 전환
function HappyBankPage() {
  const { banks, hasBank, createBank, updateBank, deleteBank } = useHappyBank();
  const { addRecord, getRecords, removeRecord, resetRecords } = useSavingsRecords();
  const { addAchievement } = useAchievements();

  // currentView: 'main' | 'setup' | 'edit' | 'deposit' | 'withdraw' | 'detail'
  const [currentView, setCurrentView] = useState('main');
  const [selectedBankId, setSelectedBankId] = useState(null);
  // 저금 기록이 없을 때 행복인출 시 빈 상태 모달 표시 여부
  const [showWithdrawEmpty, setShowWithdrawEmpty] = useState(false);

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? null;

  // 통장 완료 처리: 성취기록관에 저장 후 통장과 기록을 모두 삭제
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
          // 개설 직후 바로 저금하기로 넘어가는 경로 (수정 모드에선 없음)
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

  // 행복인출
  if (currentView === 'withdraw' && selectedBank) {
    return (
      <div className="happyBankPageOverlay">
        <WithdrawPage
          bankInfo={{ ...selectedBank, userName: '김슈니' }} // TODO: 로그인 후 실제 닉네임으로 교체
          records={getRecords(selectedBankId)}
          onBack={() => setCurrentView('detail')}
          // 기록 삭제 후 상세 화면으로 복귀
          onDelete={(recordId) => { removeRecord(selectedBankId, recordId); setCurrentView('detail'); }}
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
    const detailRecords = getRecords(selectedBankId);
    return (
      <>
        <BankDetailView
          bank={selectedBank}
          records={detailRecords}
          onBack={() => { setSelectedBankId(null); setCurrentView('main'); }}
          onDeposit={() => setCurrentView('deposit')}
          onWithdraw={() => {
            // 저금 기록이 없으면 인출 대신 안내 모달 표시 -> TODO: 백엔드 연동 시 변경가능성 있음
            if (detailRecords.length === 0) setShowWithdrawEmpty(true);
            else setCurrentView('withdraw');
          }}
          onEdit={() => setCurrentView('edit')}
          onComplete={() => { handleComplete(selectedBankId); setSelectedBankId(null); setCurrentView('main'); }}
        />
        {showWithdrawEmpty && (
          <WithdrawEmptyModal
            onBack={() => setShowWithdrawEmpty(false)}
            onDeposit={() => { setShowWithdrawEmpty(false); setCurrentView('deposit'); }}
          />
        )}
      </>
    );
  }

  // 통장 없음: 첫 통장 생성 유도 화면
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
      {banks.map((bank) => {
        const records = getRecords(bank.id);
        const currentAmount = records.reduce((sum, r) => sum + r.amount, 0);
        return (
          <BankSummaryCard
            key={bank.id}
            bankInfo={{ ...bank, currentAmount }}
            onClick={() => { setSelectedBankId(bank.id); setCurrentView('detail'); }}
            onDeposit={() => { setSelectedBankId(bank.id); setCurrentView('deposit'); }}
            onWithdraw={() => {
              setSelectedBankId(bank.id);
              if (records.length === 0) setShowWithdrawEmpty(true);
              else setCurrentView('withdraw');
            }}
            onEdit={() => { setSelectedBankId(bank.id); setCurrentView('edit'); }}
          />
        );
      })}
      <AddBankButton onClick={() => setCurrentView('setup')} />
      {showWithdrawEmpty && (
        <WithdrawEmptyModal
          onBack={() => setShowWithdrawEmpty(false)}
          onDeposit={() => { setShowWithdrawEmpty(false); setCurrentView('deposit'); }}
        />
      )}
    </div>
  );
}

export default HappyBankPage;
