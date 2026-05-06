import { useState } from 'react';

const useSavingsRecords = () => {
  const [recordsByBank, setRecordsByBank] = useState({});

  const addRecord = (bankId, record) => {
    setRecordsByBank((prev) => ({
      ...prev,
      [bankId]: [record, ...(prev[bankId] ?? [])],
    }));
  };

  const getRecords = (bankId) => recordsByBank[bankId] ?? [];

  const resetRecords = (bankId) => {
    setRecordsByBank((prev) => {
      const next = { ...prev };
      delete next[bankId];
      return next;
    });
  };

  return { addRecord, getRecords, resetRecords };
};

export default useSavingsRecords;
