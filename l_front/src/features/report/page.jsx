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
  const { selectedDate, setSelectedDate, report, isLoading, error, emptyMonths } = useMonthlyReport();
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
  if (error || !report) return <div className="reportPage" />;

  const { totalExpense, emotionCount, emotionRatio, satisfactionByEmotion } = report;

  return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} emptyMonths={emptyMonths} />
      </div>
      <ReportSummaryRow totalExpense={totalExpense} emotionCount={emotionCount} />
      <EmotionSpendingSection data={emotionRatio} />
      <EmotionSatisfactionSection data={satisfactionByEmotion} />
      <HappyBankNudgeBanner onPress={handleNudgeBanner} />
    </div>
  );
}

export default ReportPage;
