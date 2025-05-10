import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function NavBar() {
  const baseTextCss = "text-gray-700 transition";
  const activeTextCss = "text-brand font-semibold";
  const underCssBase =
    "absolute left-0 bottom-0 h-0.5 bg-brand transition-all duration-300";

  return (
    <nav className="font-noto bg-white shadow-md w-full z-50 px-4">
      <div className="flex items-center h-16">
        <Link to="/">
          <div className="flex-shrink-0 text-xl font-bold text-brand mr-20">
            FinLog
          </div>
        </Link>
        <ul className="flex flex-row items-center gap-6">
          <li>
            <NavLink to="/dashboard" className="relative group">
              {({ isActive }) => (
                <>
                  <span
                    className={`${baseTextCss} group-hover:text-brand ${
                      isActive ? activeTextCss : ""
                    }`}
                  >
                    한 눈에 보기
                  </span>
                  <span
                    className={`${underCssBase} ${
                      isActive ? "w-full" : "w-0"
                    } group-hover:w-full`}
                  ></span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/income-expense" className="relative group">
              {({ isActive }) => (
                <>
                  <span
                    className={`${baseTextCss} group-hover:text-brand ${
                      isActive ? activeTextCss : ""
                    }`}
                  >
                    수입/지출
                  </span>
                  <span
                    className={`${underCssBase} ${
                      isActive ? "w-full" : "w-0"
                    } group-hover:w-full`}
                  ></span>
                </>
              )}
            </NavLink>
          </li>
          <li className="text-gray-500">저축/투자</li>
          <li>
            <NavLink to="/settings" className="relative group">
              {({ isActive }) => (
                <>
                  <span
                    className={`${baseTextCss} group-hover:text-brand ${
                      isActive ? activeTextCss : ""
                    }`}
                  >
                    설정
                  </span>
                  <span
                    className={`${underCssBase} ${
                      isActive ? "w-full" : "w-0"
                    } group-hover:w-full`}
                  ></span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
