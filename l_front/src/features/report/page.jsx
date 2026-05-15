import { useNavigate } from 'react-router-dom';
import MonthSelector from './components/MonthSelector';
import ReportSummaryRow from './components/ReportSummaryRow';
import EmotionSpendingSection from './components/emotion/EmotionSpendingSection';
import EmotionSatisfactionSection from './components/correlation/EmotionSatisfactionSection';
import HappyBankNudgeBanner from './components/summary/HappyBankNudgeBanner';
import useMonthlyReport from './hooks/useMonthlyReport';
import './styles/page.css';

function ReportPage() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate, report } = useMonthlyReport();
  const { totalExpense, emotionCount, emotionRatio, satisfactionByEmotion, hasNegativeWarning } = report;

  const handleNudgeBanner = () => {
    const banks = JSON.parse(localStorage.getItem('lagom_banks') ?? '[]');
    if (banks.length === 0) {
      navigate('/happybank');
    } else {
      navigate('/happybank', { state: { initialView: 'deposit', bankId: banks[0].id, defaultType: 'become' } });
    }
  };

  return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      </div>
      <ReportSummaryRow totalExpense={totalExpense} emotionCount={emotionCount} />
      <EmotionSpendingSection data={emotionRatio} />
      <EmotionSatisfactionSection data={satisfactionByEmotion} />
      {hasNegativeWarning && (
        <HappyBankNudgeBanner onPress={handleNudgeBanner} />
      )}
    </div>
  );
}

export default ReportPage;
