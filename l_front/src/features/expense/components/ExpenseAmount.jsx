import React, { useState } from 'react'
import DisClosure from '../../../assets/icons/common/DisClosure';
import Devider from '../../../assets/icons/common/Devider';
import Delite from '../../../assets/icons/common/Delite';

const ExpenseAmount = ({
  type,
  setType,
  formData,
  setFormData,
  handleChange
}) => {
  const [isVisibleT, setIsVisibleT] = useState(false);

  const HandleType = () => {
    setIsVisibleT(!isVisibleT);
  };

  const handleTypeChange = (e) => {
    const type = e.currentTarget.id;

    setType(type);
    setIsVisibleT(!isVisibleT);
    setFormData(prev => ({
      ...prev,
      type: type,
    }));
  };

  const handleDeleteAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: '',
    }));
  };

  return (
    <div className='contents2'>
      <div className='type-content'>
        <div className='label'>거래유형</div>
        <div
          className="dropdown"
        >
          <button
            type="button"
            className="dropdown-button"
            onClick={HandleType}
          >
            {type == "INCOME" ? "수입" : "지출"}
            <DisClosure fill='#E6E8EA' />
          </button>
          {isVisibleT && (
            <ul className="dropdown-list">
              <li
                key="INCOME"
                id="INCOME"
                onClick={handleTypeChange}
              >
                수입
              </li>
              <Devider width={100} />
              <li
                key="EXPENSE"
                id="EXPENSE"
                onClick={handleTypeChange}
              >
                지출
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className='amount-content'>
        <label for='amount'>금액</label>
        <div tabindex="0" className='input-content'>
          <input
            type='number'
            id='amount'
            name='amount'
            placeholder='0원'
            value={formData?.amount}
            onChange={handleChange}
          ></input>
          <div className='clear' onClick={handleDeleteAmount}>
            <Delite />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseAmount