import { useMemo } from 'react';
import { formatDate } from './dateUtil.js'

/**
 * URL 파라미터(year, month)를 바탕으로 
 * 주간 달력을 위한 확장된 날짜 범위를 계산하는 훅
 */
export const useExtendedRange = (year, month) => {
  return useMemo(() => {
    // // useParams는 문자열을 반환하므로 숫자로 변환 (month는 1~12로 들어온다고 가정)
    // const y = parseInt(year, 10);
    // const m = parseInt(month, 10) - 1; // JS Date는 0부터 시작

    if (isNaN(year) || isNaN(month)) return { start: null, end: null };

    // 1. 해당 월의 첫날과 마지막날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    // 2. 앞뒤 6일 확장
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - 6);

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + 6);

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  }, [year, month]); // URL 파라미터가 바뀔 때만 재계산
};