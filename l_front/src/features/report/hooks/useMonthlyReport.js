import { useState } from 'react';

// API 연동 전 목 데이터
// 실제 연동 시 이 데이터를 API 응답으로 교체
const MOCK_REPORT = {
  totalExpense: 60300,
  emotionCount: 18,
  // 도넛 차트용 감정별 소비 비율
  // 비율 내림차순 정렬 — 차트/범례에서 인덱스 기준으로 색상 배열 적용
  emotionRatio: [
    { emotion: '행복', ratio: 33 },
    { emotion: '스트레스', ratio: 27 },
    { emotion: '평온', ratio: 20 },
    { emotion: '우울', ratio: 13 },
    { emotion: '기타', ratio: 7 },
  ],
  // 가로 막대 차트용 감정별 평균 만족도 (1~5점)
  satisfactionByEmotion: [
    { emotion: '행복', avgScore: 4.3 },
    { emotion: '스트레스', avgScore: 3.8 },
    { emotion: '무기력', avgScore: 2.0 },
    { emotion: '우울', avgScore: 2.0 },
    { emotion: '평온', avgScore: 1.4 },
  ],
  // 부정감정 경고 배너 표시 여부
  hasNegativeWarning: true,
};

const useMonthlyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // TODO: API 연동 시 { year, month } 기준으로 fetch
  const report = MOCK_REPORT;

  return { selectedDate, setSelectedDate, year, month, report };
};

export default useMonthlyReport;
