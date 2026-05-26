import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

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
  // 데이터가 존재하는 월 목록 (Set<"YYYY-M">), null이면 아직 로딩 중
  const [availableMonths, setAvailableMonths] = useState(null);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // 마운트 시 데이터 존재 월 목록 조회
  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${BASE_URL}/reports/available-months`, {
          params: { userId: getUserIdFromToken() },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('데이터 존재 월 목록:', data);
        // 백엔드 응답 형태에 따라 "YYYY-M" Set으로 변환
        // ex) [{year:2026,month:5}, ...] 또는 ["2026-05", ...]
        const set = new Set(
          data.map((item) =>
            typeof item === 'string'
              ? item.replace(/^(\d{4})-0?(\d+)$/, '$1-$2') // "2026-05" → "2026-5"
              : `${item.year}-${item.month}`
          )
        );
        setAvailableMonths(set);
      } catch (err) {
        console.error('데이터 존재 월 목록 불러오기 실패', err);
        setAvailableMonths(new Set()); // 실패 시 빈 Set (미래 월만 막힘)
      }
    };

    fetchAvailableMonths();
  }, []);

  // selectedDate(년/월)가 바뀔 때마다 API 재호출
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      setIsUsingMockData(false);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${BASE_URL}/reports/monthly`, {
          params: { year, month, userId: getUserIdFromToken() },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log(`월별 리포트 응답 (${year}년 ${month}월):`, data);

        const emotionRatio = Object.entries(data.emotionExpenseRatio ?? {})
          .map(([emotion, ratio]) => ({ emotion, ratio }))
          .sort((a, b) => b.ratio - a.ratio);

        const satisfactionByEmotion = Object.entries(data.emotionAvgEvaluation ?? {})
          .map(([emotion, avgScore]) => ({ emotion, avgScore }))
          .sort((a, b) => b.avgScore - a.avgScore);

        setReport({
          totalExpense: data.totalExpense ?? 0,
          emotionCount: data.emotionCount ?? 0,
          emotionRatio,
          satisfactionByEmotion,
        });
      } catch (err) {
        console.error('월별 리포트 불러오기 실패', err);
        if (ENABLE_REPORT_MOCK_FALLBACK) {
          console.warn('개발 환경에서 월별 리포트 목데이터를 사용합니다.');
          setReport(MOCK_REPORT);
          setIsUsingMockData(true);
        } else {
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
    availableMonths,
  };
};

export default useMonthlyReport;
