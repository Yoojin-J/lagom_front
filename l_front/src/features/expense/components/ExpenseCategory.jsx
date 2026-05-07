import React, { useState, Fragment } from 'react'
import DisClosure from '../../../assets/icons/common/DisClosure';
import ChevronUp from '../../../assets/icons/common/ChevronUp';

const ExpenseCategory = ({
  category,
  setCategory,
  categoryOptions,
  setFormData,
  targetCategory,
  type,
  IconComponent
}) => {
  const [isVisibleC, setIsVisibleC] = useState(false);

  const handleCat = () => {
    setIsVisibleC(!isVisibleC);
  };

  const handleCatChange = (e) => {
    const category = e.currentTarget.id;

    setCategory(category);
    setIsVisibleC(!isVisibleC);
    setFormData(prev => ({
      ...prev,
      category: category,
    }));
  };

  return (
    <div className='category-content'>
      <div className='label'>카테고리 설정</div>
      <div
        className='category-down'
      >
        {!isVisibleC && <button
          type="button"
          className={`category-button ${category === 'none' ? '' : 'selected'}`}
          onClick={handleCat}
        >
          {category === 'none' ? '카테고리 없음' : targetCategory?.label || category}
          <div className='chevron'><DisClosure fill='#E6E8EA' /></div>
        </button>}
        {isVisibleC && (
          <ul className="category-list">
            {type && categoryOptions[type].map((cat, index, array) => {
              const IconComponent = cat.icon;

              return (
                <Fragment key={cat.value}>
                  <li key={cat.value} id={cat.value} onClick={handleCatChange}>
                    <div className='category-icon' style={cat.color}>
                      <IconComponent
                        width={14}
                        height={14}
                      />
                    </div>
                    <div className='category-label'>{cat.label}</div>
                    <div className='chevron'>{index === 0 && <ChevronUp />}</div>
                  </li>
                  {index < array.length - 1 && <div className='devider' />}
                </Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ExpenseCategory