import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="font-noto bg-white shadow-md w-full z-50 px-4">
      <div className="flex items-center h-16">
        <Link to="/">
          <div className="flex-shrink-0 text-xl font-bold text-gray-600 mr-20">
            FinLog
          </div>
        </Link>
        <ul className="flex flex-row items-center spce-x-6 gap-6">
          <li>
            <Link to="/dashboard">한 눈에 보기</Link>
          </li>
          <li>
            <Link to="/income-expense">수입/지출</Link>
          </li>
          <li>
            <Link to="/transactionform">입력</Link>
          </li>
          <li>자산</li>
          <li>설정</li>
        </ul>
      </div>
    </nav>
  );
}
