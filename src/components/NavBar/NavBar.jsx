import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const textCss =
    "text-gray-700 group-hover:text-brand transition group-hover:font-semibold";
  const underCss =
    "absolute left-0 bottom-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300";
  return (
    <nav className="font-noto bg-white shadow-md w-full z-50 px-4">
      <div className="flex items-center h-16">
        <Link to="/">
          <div className="flex-shrink-0 text-xl font-bold text-brand mr-20">
            FinLog
          </div>
        </Link>
        <ul className="flex flex-row items-center spce-x-6 gap-6">
          <li>
            <Link to="/dashboard" className="relative group">
              <span className={textCss}>한 눈에 보기</span>
              <span className={underCss}></span>
            </Link>
          </li>
          <li>
            <Link to="/income-expense" className="relative group">
              <span className={textCss}>수입/지출</span>
              <span className={underCss}></span>
            </Link>
          </li>
          <li>자산</li>
          <Link to="/settings" className="relative group">
            <span className={textCss}>설정</span>
            <span className={underCss}></span>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
