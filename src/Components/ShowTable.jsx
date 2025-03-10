import React, { useState } from 'react';
import Picker from './Picker';
import TransactionList from './TransactionList';

export default function ShowTable() {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [searchParams, setSearchParams] = useState(null); // 조회 조건 저장
  
    // 입력값 업데이트 함수들
    const handleYearChange = (value) => setYear(value);
    const handleMonthChange = (value) => setMonth(value);
    const handleFilterChange = (value) => setFilterValue(value);
  
    // 조회 버튼 클릭 시 실행
    const handleSearch = () => {
      setSearchParams({ year, month, filterValue }); // 입력값을 한 번에 저장
    };

    return (
        <div>
            <h1>조회 결과</h1>
            <Picker onYearChange={handleYearChange} onMonthChange={handleMonthChange} onFilterChange={handleFilterChange} onSearch={handleSearch} />
            {searchParams && (
                <TransactionList year={searchParams.year} month={searchParams.month} filterType={'main_category'} filterValue={searchParams.filterValue} />
            )}
        </div>
    )
}