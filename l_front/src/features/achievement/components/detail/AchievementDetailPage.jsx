import { useEffect, useRef, useState } from 'react';
import SavingsProgressPanel from '../../../happyBank/components/SavingsProgressPanel';
import SavingsRecordList from '../../../happyBank/components/SavingsRecordList';
import SavingsRecordModal from '../../../happyBank/components/detail/SavingsRecordModal';
import '../../styles/detail/AchievementDetailPage.css';

function AchievementDetailPage({ achievement, onBack }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { id, name, startDate, endDate, totalAmount, happySavings, becomeSavings, goalType, goalAmount, records = [] } = achievement;

  // 브라우저 뒤로가기와 state 내비게이션 연결 -> 전체에서도 적용되게끔 shared hook으로 뺄지?
  const onBackRef = useRef(onBack);
  useEffect(() => { onBackRef.current = onBack; }, [onBack]);
  useEffect(() => {
    window.history.pushState(null, '');
    const handler = () => onBackRef.current?.();
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return (
    <div className="achievementDetailPage">
      {/* 회차 요약 카드 */}
      <div className="achievementDetailPage__header">
        <div className="achievementDetailPage__headerLeft">
          <p className="achievementDetailPage__title">{id}회차 행복통장</p>
          <p className="achievementDetailPage__date">{startDate} – {endDate}</p>
        </div>
        <p className="achievementDetailPage__total">{totalAmount.toLocaleString('ko-KR')}원</p>
      </div>

      {/* 행복저금 / 행복해지는저금 진행바 — SavingsProgressPanel 재사용 */}
      <SavingsProgressPanel
        happySavings={happySavings}
        becomeSavings={becomeSavings}
        goalAmount={goalAmount}
        goalType={goalType}
      />

      {/* 월별 기록 목록 — SavingsRecordList 재사용 */}
      {records.length > 0 && (
        <SavingsRecordList records={records} onRecordClick={setSelectedRecord} />
      )}

      {/* 기록 상세 모달 — SavingsRecordModal 재사용 */}
      {selectedRecord && (
        <SavingsRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}

export default AchievementDetailPage;
