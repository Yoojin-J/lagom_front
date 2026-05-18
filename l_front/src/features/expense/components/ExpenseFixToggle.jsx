import React from 'react'
import ToggleOn from '../../../assets/icons/toggle/ToggleOn'
import ToggleOff from '../../../assets/icons/toggle/ToggleOff'

const ExpenseFixToggle = ({
  formData,
  setFormData,
}) => {
  const handleFix = () => {
    setFormData(prev => ({
      ...prev,
      is_recurring: !prev.is_recurring
    }))
  };

  return (
    <div className='fix-toggle-row'>
      <div className='toggle-row-text'>
        <div className='title'>{`고정 ${formData.type === 'INCOME' ? '수입으' : '지출'}로 설정`}</div>
        <div className='sub'>매 주기마다 자동으로 기록돼요</div>
      </div>
      <div className='toggle-row-img' onClick={handleFix}>
        {formData.is_recurring ? <ToggleOn /> : <ToggleOff />}
      </div>
    </div>
  )
}

export default ExpenseFixToggle