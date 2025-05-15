import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/utils/useAuthStore";
import { LogOut as LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function NavBar() {
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const baseTextCss = "text-gray-700 transition";
  const activeTextCss = "text-brand font-semibold";
  const underCssBase =
    "absolute left-0 bottom-0 h-0.5 bg-brand transition-all duration-300";

  return (
    <nav className="font-noto bg-white shadow-md w-full z-50 px-4">
      <div className="flex items-center h-16">
        <Link to="">
          <div className="flex-shrink-0 text-xl font-bold text-brand mr-20">
            FinLog
          </div>
        </Link>
        <ul className="flex flex-row items-center gap-6">
          <li>
            <NavLink to="dashboard" className="relative group">
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
            <NavLink to="income-expense" className="relative group">
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
          <NavLink to="save-investment" className="relative group">
            {({ isActive }) => (
              <>
                <span
                  className={`${baseTextCss} group-hover:text-brand ${
                    isActive ? activeTextCss : ""
                  }`}
                >
                  저축/투자
                </span>
                <span
                  className={`${underCssBase} ${
                    isActive ? "w-full" : "w-0"
                  } group-hover:w-full`}
                ></span>
              </>
            )}
          </NavLink>
          <li>
            <NavLink to="settings" className="relative group">
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
        {user && (
          <div className="ml-auto">
            <div className="flex items-center gap-4">
              {/* 사용자 정보 표시 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {user.user_metadata?.name} 님 반갑습니다!
                </span>
                <img
                  src={user.user_metadata?.avatar_url}
                  alt="아바타"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOutIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
