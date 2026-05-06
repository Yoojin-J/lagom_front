import { useState } from 'react';

/**
 * 입금(저금하기) 제출 로직 훅
 * @returns {{ isLoading: boolean, handleSubmit: Function }}
 */
const useDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);

  // TODO: API 연동 후 교체
  const handleSubmit = async (depositData) => {
    setIsLoading(true);
    try {
      console.log('저금하기 제출:', depositData);
      // await api.post('/deposit', depositData);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
};

export default useDeposit;
