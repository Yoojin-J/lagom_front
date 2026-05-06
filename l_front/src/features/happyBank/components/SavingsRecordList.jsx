import SavingsRecordItem from './SavingsRecordItem';
import MonthDivider from './MonthDivider';
import '../styles/SavingsRecordList.css';

/**
 * 월별 저금 기록 리스트
 * @param {Array} records - 저금 기록 목록
 * @param {Function} onRecordClick - 기록 클릭 핸들러
 */
function SavingsRecordList({ records, onRecordClick }) {
  // 날짜 기준 내림차순 정렬 후 월별로 그룹화
  // 결과: [{ month: '3월', records: [...] }, ...]
  const grouped = records
    .slice()
    .sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')))
    .reduce((acc, record) => {
      const month = record.date.split('.')[1] + '월';
      const existing = acc.find((g) => g.month === month);
      if (existing) {
        existing.records.push(record);
      } else {
        acc.push({ month, records: [record] });
      }
      return acc;
    }, []);

  return (
    <div className="savingsRecordList">
      {grouped.map(({ month, records: monthRecords }) => (
        <div key={month} className="savingsRecordList__group">
          <MonthDivider month={month} />
          {monthRecords.map((record) => (
            <SavingsRecordItem
              key={record.id}
              {...record}
              onClick={() => onRecordClick?.(record)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SavingsRecordList;
