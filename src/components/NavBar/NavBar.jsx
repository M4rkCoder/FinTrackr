import React, { useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAccountStore } from "@/stores/useAccountStore";
import { LogOut as LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SimpleLogo from "./simplelogo";
import registerUser from "@/utils/registerUser";

export default function NavBar() {
  useEffect(() => {
    registerUser();
  }, []);
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logout);
  const account = useAccountStore((state) => state.account);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const baseTextCss = "transition font-bold";
  const activeTextCss = "text-brand font-semibold";
  const underCssBase =
    "absolute left-0 top-9 h-1 bg-brand transition-all duration-300";

  return (
    <nav className="font-noto bg-white/50 backdrop-blur-sm fixed top-0 left-0 shadow-md w-full z-50 px-4">
      <div className="flex flex-row justify-between mx-auto items-center w-4/5 h-16">
        <Link to="">
          <div className="flex items-center text-3xl font-bold text-brand gap-0 ">
            <SimpleLogo className="align-middle" />
            <span className="font-logo ml-2">FinLog</span>
          </div>
        </Link>
        <ul className="ml-10 flex flex-row items-center gap-6">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.name}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-50">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          {account?.name}
                        </h4>
                        <h4 className="font-medium leading-none">
                          {user.user_metadata.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {user.user_metadata.email}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOutIcon /> 로그아웃
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
