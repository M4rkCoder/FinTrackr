import React from 'react';
import './picker.css';

export default function Picker({ onYearChange, onMonthChange, onFilterChange, onSearch }) {
  return (
    <div className='picker'>
      <div>
        <label>연도: </label>
        <input type="text" onChange={(e) => onYearChange(e.target.value)} />
      </div>
      <div>
        <label>월: </label>
        <input type="text" onChange={(e) => onMonthChange(e.target.value)} />
      </div>
      <div>
        <label>필터 값: </label>
        <input type="text" onChange={(e) => onFilterChange(e.target.value)} />
      </div>
      <button onClick={onSearch}>조회</button>
    </div>
  );
}