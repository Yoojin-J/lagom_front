import { useNavigate } from 'react-router-dom';
import MonthSelector from './components/MonthSelector';
import ReportSummaryRow from './components/ReportSummaryRow';
import EmotionSpendingSection from './components/emotion/EmotionSpendingSection';
import EmotionSatisfactionSection from './components/correlation/EmotionSatisfactionSection';
import HappyBankNudgeBanner from './components/summary/HappyBankNudgeBanner';
import useMonthlyReport from './hooks/useMonthlyReport';
import useHappyBank from '../happyBank/hooks/useHappyBank';
import './styles/page.css';

function ReportPage() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate, report, isLoading, error, availableMonths } = useMonthlyReport();
  // 넛지 배너 클릭 시 통장 유무에 따라 분기
  const { banks } = useHappyBank();

  const handleNudgeBanner = () => {
    if (banks.length === 0) {
      // 통장이 없으면 개설 화면으로
      navigate('/happybank/setup');
    } else {
      // 통장이 있으면 첫 번째 통장의 저금 화면으로, 기본값 '행복해지는 저금'
      navigate(`/happybank/${banks[0].id}/deposit`, { state: { initialType: 'become' } });
    }
  };

  if (isLoading) return <div className="reportPage" />;

  if (error || !report) return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} availableMonths={availableMonths} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', paddingTop: '80px' }}>
        <p style={{ margin: 0, color: '#B1B8BE', fontFamily: 'Pretendard', fontSize: '14px', fontStyle: 'normal', fontWeight: 500, lineHeight: '130%' }}>이 달의 기록이 없습니다</p>
      </div>
    </div>
  );

  const { totalExpense, emotionCount, emotionRatio, satisfactionByEmotion } = report;

  //비율 차이 계산 (%)
  const insightRate = (() => {
    if (!emotionRatio || emotionRatio.length < 2) return null;
    const avgRatio = emotionRatio.reduce((sum, e) => sum + e.ratio, 0) / emotionRatio.length;
    if (avgRatio === 0) return null;
    return Math.round(((emotionRatio[0].ratio - avgRatio) / avgRatio) * 100);
  })();

  return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} availableMonths={availableMonths} />
      </div>
      <ReportSummaryRow totalExpense={totalExpense} emotionCount={emotionCount} />
      <EmotionSpendingSection data={emotionRatio} insightRate={insightRate} />
      <EmotionSatisfactionSection data={satisfactionByEmotion} />
      <HappyBankNudgeBanner onPress={handleNudgeBanner} />
    </div>
  );
}

export default ReportPage;
