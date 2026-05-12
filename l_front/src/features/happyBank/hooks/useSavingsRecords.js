import { useState } from 'react';

const STORAGE_KEY = 'lagom_records';

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const useSavingsRecords = () => {
  const [recordsByBank, setRecordsByBank] = useState(load);

  const addRecord = (bankId, record) => {
    setRecordsByBank((prev) => {
      const next = { ...prev, [bankId]: [record, ...(prev[bankId] ?? [])] };
      save(next);
      return next;
    });
  };

  const getRecords = (bankId) => recordsByBank[String(bankId)] ?? recordsByBank[bankId] ?? [];

  const removeRecord = (bankId, recordId) => {
    setRecordsByBank((prev) => {
      const key = String(bankId);
      const next = { ...prev, [key]: (prev[key] ?? []).filter((r) => r.id !== recordId) };
      save(next);
      return next;
    });
  };

  const resetRecords = (bankId) => {
    setRecordsByBank((prev) => {
      const next = { ...prev };
      delete next[bankId];
      delete next[String(bankId)];
      save(next);
      return next;
    });
  };

  return { addRecord, getRecords, removeRecord, resetRecords };
};

export default useSavingsRecords;
