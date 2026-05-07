import React from 'react'

const ExpenseEmotion = ({
  formData,
  setFormData,
  emotionOptions,
  satisfactionOptions,
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
    </div>
  )
}

export default ExpenseEmotion