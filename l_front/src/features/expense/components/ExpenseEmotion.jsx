import React from 'react'
import ChevronRight from '../../../assets/icons/common/ChevronRight';

const ExpenseEmotion = ({
  formData,
  setFormData,
  emotionOptions,
  satisfactionOptions,
  isEditMode,
  isReEva,
}) => {
  const handleEmotion = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    // setSelectedEmo((prev) => (prev === val ? null : val));
    setFormData((prev) => ({
      ...prev,
      emotion: prev.emotion === val ? null : val
    }));
  };

  const handleSatisfaction = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    // setSelectedSat((prev) => (prev === val ? null : val));
    setFormData((prev) => ({
      ...prev, //
      evaluation: prev.evaluation === val ? null : val
    }));
  };

  const goHappyBank = () => {
    // 행복해지는 저금으로 가기전 일단 가계부 저장 (fetch, post)
    // 그 후에 행복저금으로 이동
    // 행복저금으로 이동할 때 금액만 들고 가면 되는건가? (navigate)

  };

  return (
    <div className='expense-section'>
      <div className='emotion-section'>
        <div className='emotion-label'>감정</div>
        <ul className='emotion-option-container'>
          {formData.type === 0 && emotionOptions.map((emo) => {
            const isSelected = formData.emotion === emo.value;

            return (
              <li key={emo.value} value={emo.value} className='emotion-btn' onClick={() => handleEmotion(emo.value)}>
                <div className={`emotion-icon ${isSelected ? 'selected' : ''}`}>{emo.icon}</div>
                <div className={`emotion-name ${isSelected ? 'selected' : ''}`}>{emo.label}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='satisfaction-section'>
        <div className='satisfaction-label'>소비 만족도</div>
        <ul className='satisfaction-option-container'>
          {formData.type === 0 && satisfactionOptions.map((sat) => {
            const isSelected = formData.evaluation === sat.value;

            return (
              <li key={sat.value} value={sat.value} className='satisfaction-btn' onClick={() => handleSatisfaction(sat.value)}>
                <div className={`satisfaction-icon ${isSelected ? 'selected' : ''}`}>{sat.icon}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.label}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.percent}</div>
              </li>
            );
          })}
        </ul>
      </div>
      {(!isEditMode && !isReEva) && (formData.emotion === 3 || formData.emotion === 4 || formData.emotion === 5) && (formData.evaluation === 0 || formData.evaluation === 25) &&
        <div className='alert-banner'>
          <div className='alert-text'>
            <div className='text1'>현재 소비 감정, 만족도가 낮아요</div>
            <div className='text2'>행복 저금으로 기분을 전환해볼까요?</div>
          </div>
          <ChevronRight stroke="#F7645F" />
        </div>
      }
    </div>
  )
}

export default ExpenseEmotion