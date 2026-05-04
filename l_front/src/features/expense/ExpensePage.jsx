import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import DatePicker from './components/DatePickerExpense';
import './styles/ExpensePage.css';
import ExpenseTitle from './components/ExpenseTitle';
import ExpenseAmount from './components/ExpenseAmount';
import ExpenseCategory from './components/ExpenseCategory';
import ExpenseMemo from './components/ExpenseMemo';
import ExpenseEmotion from './components/ExpenseEmotion';
import ExpenseFixToggle from './components/ExpenseFixToggle';
import ExpenseFixSetting from './components/ExpenseFixSetting';

import SystemMore from '../../assets/icons/common/SystemMore';
import Salary from '../../assets/icons/category/Salary';
import SideIncome from '../../assets/icons/category/SideIncome';
import Allowance from '../../assets/icons/category/Allowance';
import Bonus from '../../assets/icons/category/Bouns';
import Investment from '../../assets/icons/category/Investment';
import Food from '../../assets/icons/category/Food';
import Housing from '../../assets/icons/category/Housing';
import Transport from '../../assets/icons/category/Transport';
import Medical from '../../assets/icons/category/Medical';
import Leisure from '../../assets/icons/category/Leisure';
import Shopping from '../../assets/icons/category/Shopping';
import Beauty from '../../assets/icons/category/Beauty';
import Education from '../../assets/icons/category/Education';

import Happy from '../../assets/icons/emotion/Happy';
import Excitement from '../../assets/icons/emotion/Excitement';
import Serenity from '../../assets/icons/emotion/Serenity';
import Depressed from '../../assets/icons/emotion/Depressed';
import Stress from '../../assets/icons/emotion/Stress';
import Impulse from '../../assets/icons/emotion/Impulse';

import Mad from '../../assets/icons/satisfaction/Mad';
import Angry from '../../assets/icons/satisfaction/Angry';
import Common from '../../assets/icons/satisfaction/Common';
import Satisfied from '../../assets/icons/satisfaction/Satisfied';
import Excited from '../../assets/icons/satisfaction/Exited';

import ChevronLeft from '../../assets/icons/common/ChevronLeft';
  
const ExpensePage = () => {
  const location = useLocation();
  const [type, setType] = useState('INCOME');                   // INCOME or EXPENSE
  const [category, setCategory] = useState('none');             // 선택된 카테고리
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 (이체일시)
  const [memo, setMemo] = useState("");                         // 메모
  const [selectedEmo, setSelectedEmo] = useState(null);         // 선택된 감정
  const [selectedSat, setSelectedSat] = useState(null);         // 선택된 소비 만족도
  const [isFix, setIsFix] = useState(false);                    // 고정 설정? 
  const [selectedPeriod, setSelectedPeriod] = useState('day');  // 매일/매주/매달
  const [selectedCycle, setSelectedCycle] = useState([]);       // 주 언제/달 언제
  const [startDate, setStartDate] = useState(null);             // 고정 시작 날짜 
  const [endDate, setEndDate] = useState(null);                 // 고정 종료 날짜
  const [formData, setFormData] = useState({
    title: '',
    type: type,
    amount: '',
    date: selectedDate,
    category: category,
  });


  // 거래유형에 따른 카테고리 목록
  const categoryOptions = {
    INCOME: [
      { value: 'none', label: '카테고리 없음', icon: SystemMore },
      { value: 'salary', label: '급여', icon: Salary, color: { background: 'var(--Category-Purple-2, #ABD8E3)' } },
      { value: 'side_income', label: '부수입', icon: SideIncome, color: { background: 'var(--Category-Deep-Blue, #B7CFD6)' } },
      { value: 'allowance', label: '용돈', icon: Allowance, color: { background: 'var(--Category-Green-2, #7EC88E)' } },
      { value: 'bonus', label: '상여금', icon: Bonus, color: { background: 'var(--Category-Purple-3, #D6B7FF)' } },
      { value: 'investment', label: '금융수입', icon: Investment, color: { background: 'var(--Category-Deep-Blue-2, #9FBFC9)' } },
      { value: 'other_income', label: '기타', icon: SystemMore },
    ],
    EXPENSE: [
      { value: 'none', label: '카테고리 없음', icon: SystemMore },
      { value: 'food', label: '식비', icon: Food, color: { background: 'var(--Category-Blue, #9ED2FA)' } },
      { value: 'housing', label: '주거/통신', icon: Housing, color: { background: 'var(--Category-Purple, #E2CCFF)' } },
      { value: 'transport', label: '교통/차량', icon: Transport, color: { background: 'var(--Category-Mint, #B5E2DF)' } },
      { value: 'medical', label: '의료/건강', icon: Medical, color: { background: 'var(--Category-Green, #A9DAB4)' } },
      { value: 'leisure', label: '문화/여가', icon: Leisure, color: { background: 'var(--Category-Pink, #FFCAC8)' } },
      { value: 'shopping', label: '쇼핑', icon: Shopping, color: { background: 'var(--Category-Peach, #F7AFA1)' } },
      { value: 'beauty', label: '미용', icon: Beauty, color: { background: 'var(--Category-Lavender, #EFCAF2)' } },
      { value: 'education', label: '교육', icon: Education, color: { background: 'var(--Category-Gray, #CDD1D5)' } },
      { value: 'other', label: '기타', icon: SystemMore },
    ]
  };

  // 감정 목록
  const emotionOptions = [
    { value: 'happy', label: '기쁨', icon: <Happy /> },
    { value: 'excitement', label: '설렘', icon: <Excitement /> },
    { value: 'serenity', label: '평온', icon: <Serenity /> },
    { value: 'depressed', label: '우울', icon: <Depressed /> },
    { value: 'stress', label: '스트레스', icon: <Stress /> },
    { value: 'impulse', label: '충동', icon: <Impulse /> },
  ];

  // 소비 만족도 목록
  const satisfactionOptions = [
    { value: 'mad', label: '매우 불만족', percent: '0%', icon: <Mad isActive={selectedSat === 'mad'} /> },
    { value: 'angry', label: '불만족', percent: '25%', icon: <Angry isActive={selectedSat === 'angry'} /> },
    { value: 'common', label: '보통', percent: '50%', icon: <Common isActive={selectedSat === 'common'} /> },
    { value: 'satisfied', label: '만족', percent: '75%', icon: <Satisfied isActive={selectedSat === 'satisfied'} /> },
    { value: 'excited', label: '매우 만족', percent: '100%', icon: <Excited isActive={selectedSat === 'excited'} /> },
  ];

  // selectedCycle에서 사용하는 기간 리스트(매주)
  const weekList = [
    { value: 'mon', label: '월' },
    { value: 'tue', label: '화' },
    { value: 'wed', label: '수' },
    { value: 'thr', label: '목' },
    { value: 'fri', label: '금' },
    { value: 'sat', label: '토' },
    { value: 'sun', label: '금' },
  ];

  // selectedCycle에서 사용하는 기간 리스트(매달)
  // 날짜라서 1~31 map으로 돌렸는데 혹시나 List로 관리해야된다면 해당 변수 사용
  // const monthList = [
  //   {}
  // ];


  // navigate로 전달된 state를 formData에 반영 (한 번만 실행되도록)
  // 가계부 페이지에서 INCOME이냐 EXPENSE이냐를 선택하고 오기 때문에
  useEffect(() => {
    if (location.state?.type) {
      setFormData(prev => ({
        ...prev,
        type: location.state.type   // formData.type 업데이트
      }));

      setType(location.state.type);
    }
  }, [location.state]);   // location.state가 바뀔 때만 실행


  // type이 바뀔 때마다 category, memo 초기화 (선택 초기화)
  useEffect(() => {
    setCategory('none');   // 거래유형 바뀌면 카테고리 선택 초기화
    setMemo('');
  }, [type]);


  // 매일/매주/매달이 바뀔 때 마다 selectedCycle 초기화
  useEffect(() => {
    setSelectedCycle([]);
  }, [selectedPeriod]);


  // 카테고리와 내역명 옆 아이콘 동기화
  const targetCategory = useMemo(() => {
    return categoryOptions[type]?.find(item => item.value === category);
  }, [type, category]);

  const IconComponent = useMemo(() => {
    return targetCategory?.icon;
  }, [targetCategory])


  // formData 기본 값들은 handleChange로 관리
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이체일시 관리 
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };


  // 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await uploadExpense(formData);
    //   console.log('전송 성공:', response);
    // } catch (error) {
    //   console.error('전송 실패:', error);
    // }

    const data = {
      ...formData,
    };

    // formData에 key, value 값을 추가 
    if (type === 'EXPENSE') {
      data.emotion = selectedEmo;
      data.evaluation = selectedSat;
    } else if (type === 'INCOME') {
      data.memo = memo;
    }

    if (isFix) {
      data.period = selectedPeriod;
      data.cycle = selectedCycle;
      data.startDate = startDate;
      data.endDate = endDate;
    }

    console.log(data);
  };



  return (
    <div className='expense-content'>
      <div className='header'>
        <ChevronLeft stroke='#B1B8BE' />
        <div className='delete'>
          삭제하기
        </div>
      </div>
      <form className='contents'>
        <div className='contents-f'>
          {/* ExpenseTitle : 내역명(title) */}
          <ExpenseTitle
            formData={formData}
            setFormData={setFormData}
            IconComponent={IconComponent}
            handleChange={handleChange}
            targetCategory={targetCategory}
          />

          {/* ExpenseAmount : 거래유형(type), 금액(amount) */}
          <ExpenseAmount
            type={type}
            setType={setType}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />

          {/* ExpenseCategory : 카테고리 설정(category) */}
          <ExpenseCategory
            category={category}
            setCategory={setCategory}
            categoryOptions={categoryOptions}
            setFormData={setFormData}
            targetCategory={targetCategory}
            type={type}
            IconComponent={IconComponent}
          />

          {/* 이체일시(selectedDate) */}
          <div className='payment-at-content'>
            <div className='label'>이체일시</div>
            <div className='input-content'>
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleChange={handleDateChange}
              />
            </div>
          </div>

          {/* ExpenseMemo : 메모(memo) */}
          {/* ExpenseEmotion : 감정(selectedEmo), 소비만족도(selectedSat) */}
          {type === 'INCOME' ?
            <ExpenseMemo
              memo={memo}
              setMemo={setMemo}
            /> :
            <ExpenseEmotion
              selectedEmo={selectedEmo}
              setSelectedEmo={setSelectedEmo}
              selectedSat={selectedSat}
              setSelectedSat={setSelectedSat}
              type={type}
              emotionOptions={emotionOptions}
              satisfactionOptions={satisfactionOptions}
            />
          }
        </div>
        <div className='devider2' />
        <div className='contents-fix'>
          {/* ExpenseFixToggle : 고정 지출로 설정(isFix) */}
          <ExpenseFixToggle
            isFix={isFix}
            setIsFix={setIsFix}
            type={type}
          />

          {/* ExpenseFixSetting : 매일/매주/매달(selectedPeriod), 날짜설정(selectedCycle), 시작일(startDate), 종료일(endDate) */}
          {isFix &&
            <ExpenseFixSetting
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedCycle={selectedCycle}
              setSelectedCycle={setSelectedCycle}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              weekList={weekList}
            />
          }
        </div>
        <button
          type='submit'
          className='submit-btn'
          onClick={handleSubmit}
        >
          확인
        </button>
      </form>
    </div>
  )
}

export default ExpensePage