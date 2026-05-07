import MonthDivider from './MonthDivider';
import SavingsRecordItem from './SavingsRecordItem';
import '../styles/SavingsRecordList.css';

function SavingsRecordList({ records, onRecordClick }) {
  const grouped = records
    .slice()
    .sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')))
    .reduce((acc, record) => {
      const month = `${record.date.split('.')[1]}월`;
      const existing = acc.find((group) => group.month === month);

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
