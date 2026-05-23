import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const ENABLE_REPORT_MOCK_FALLBACK = import.meta.env.DEV;

// ── 목 데이터 (API 연동 전 테스트용) ──────────────────────────
const MOCK_REPORT = {
  totalExpense: 60300,
  emotionCount: 18,
  emotionRatio: [
    { emotion: '행복', ratio: 33 },
    { emotion: '스트레스', ratio: 27 },
    { emotion: '평온', ratio: 20 },
    { emotion: '우울', ratio: 13 },
    { emotion: '기타', ratio: 7 },
  ],
  satisfactionByEmotion: [
    { emotion: '행복', avgScore: 4.3 },
    { emotion: '스트레스', avgScore: 3.8 },
    { emotion: '무기력', avgScore: 2.0 },
    { emotion: '우울', avgScore: 2.0 },
    { emotion: '평온', avgScore: 1.4 },
  ],
};
// ─────────────────────────────────────────────────────────────

const useMonthlyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 월 (DatePicker 연동)
  const [report, setReport] = useState(null);                   // API 응답 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  // 데이터가 없는 월 추적 (Set<"YYYY-M">), MonthSelector 비활성화에 사용
  const [emptyMonths, setEmptyMonths] = useState(new Set());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const markEmpty = (y, m) =>
    setEmptyMonths((prev) => new Set([...prev, `${y}-${m}`]));

  // selectedDate(년/월)가 바뀔 때마다 API 재호출
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      setIsUsingMockData(false);
      try {
        const token = localStorage.getItem('accessToken'); // TODO: 로그인 구현 후 키 이름 확인
        const { data } = await axios.get(`${BASE_URL}/reports/monthly`, {
          params: { year, month, userId: 3 },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log(`월별 리포트 응답 (${year}년 ${month}월):`, data);

        // 백엔드가 Map 형태로 반환 { "행복": 33.0, "스트레스": 27.0, ... }
        // → recharts가 요구하는 배열 형태로 변환 후 내림차순 정렬
        const emotionRatio = Object.entries(data.emotionExpenseRatio ?? {})
          .map(([emotion, ratio]) => ({ emotion, ratio }))
          .sort((a, b) => b.ratio - a.ratio);
        console.log('감정별 소비 비율:', emotionRatio);

        const satisfactionByEmotion = Object.entries(data.emotionAvgEvaluation ?? {})
          .map(([emotion, avgScore]) => ({ emotion, avgScore }))
          .sort((a, b) => b.avgScore - a.avgScore);
        console.log('감정별 평균 만족도:', satisfactionByEmotion);

        const totalExpense = data.totalExpense ?? 0;
        const emotionCount = data.emotionCount ?? 0;

        // 데이터가 없는 월이면 비활성화 목록에 추가
        if (totalExpense === 0 && emotionCount === 0) markEmpty(year, month);

        setReport({ totalExpense, emotionCount, emotionRatio, satisfactionByEmotion });
      } catch (err) {
        console.error('월별 리포트 불러오기 실패', err);
        if (ENABLE_REPORT_MOCK_FALLBACK) {
          console.warn('개발 환경에서 월별 리포트 목데이터를 사용합니다.');
          setReport(MOCK_REPORT);
          setIsUsingMockData(true);
        } else {
          // API 실패 = 데이터 없음으로 간주
          markEmpty(year, month);
          setError(err);
          setReport(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [year, month]);

  return {
    selectedDate,
    setSelectedDate,
    year,
    month,
    report,
    isLoading,
    error,
    isUsingMockData,
    emptyMonths,
  };
};

export default useMonthlyReport;
