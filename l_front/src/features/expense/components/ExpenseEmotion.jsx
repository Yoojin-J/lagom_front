import React from 'react'

const ExpenseEmotion = ({
  selectedEmo,
  setSelectedEmo,
  selectedSat,
  setSelectedSat,
  type,
  emotionOptions,
  satisfactionOptions,
}) => {
  const handleEmotion = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    setSelectedEmo((prev) => (prev === val ? null : val));
  };

  const handleSatisfaction = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    setSelectedSat((prev) => (prev === val ? null : val));
  };

  return (
    <div className='expense-section'>
      <div className='emotion-section'>
        <div className='emotion-label'>감정</div>
        <div className='emotion-option-container'>
          {type && emotionOptions.map((emo) => {
            const isSelected = selectedEmo === emo.value;

            return (
              <div value={emo.value} className='emotion-btn' onClick={() => handleEmotion(emo.value)}>
                <div className={`emotion-icon ${isSelected ? 'selected' : ''}`}>{emo.icon}</div>
                <div className={`emotion-name ${isSelected ? 'selected' : ''}`}>{emo.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='satisfaction-section'>
        <div className='satisfaction-label'>소비 만족도</div>
        <div className='satisfaction-option-container'>
          {type && satisfactionOptions.map((sat) => {
            const isSelected = selectedSat === sat.value;

            return (
              <div value={sat.value} className='satisfaction-btn' onClick={() => handleSatisfaction(sat.value)}>
                <div className={`satisfaction-icon ${isSelected ? 'selected' : ''}`}>{sat.icon}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.label}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.percent}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default ExpenseEmotion