import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "@/utils/store/slices/auth/authSlice";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";

// Icons
import Home from "../assets/menu-new/home.svg";
import RedHome from "../assets/menu-new/home-a.svg";
import Calendar from "../assets/menu-new/calendar.svg";
import RedCalendar from "../assets/menu-new/calendar-a.svg";
import Inbox from "../assets/menu-new/message.svg";
import RedInbox from "../assets/menu-new/message-a.svg";
import Scissor from "../assets/menu-new/scissor.svg";
import RedScissor from "../assets/menu-new/scissor-a.svg";
import User from "../assets/menu-new/user.svg";
import RedUser from "../assets/icon/user.svg";
import LogOut from "../assets/icon/logout.svg";
import HelpCircle from "../assets/icon/help-circle-black.svg";
import RedHelpCircle from "../assets/icon/info-circle.svg";
import Star from "../assets/icon/star-gray.svg";
import RedStar from "../assets/icon/red-star.svg";
import PlayStore from "../assets/menu-new/play-store.svg";
import AppStore from "../assets/menu-new/app-store.svg";
import { clearSelectedChat } from "@/utils/store/slices/inbox/inboxSlice";

// Sidebar item component
const SidebarItem = ({
  label,
  href,
  icon,
  activeIcon,
  active,
  onClick,
  target,
}) => (
  <Link
    to={href || "#"}
    target={target}
    onClick={onClick}
    className={`
      group flex items-center gap-3 mt-[30px] cursor-pointer
      ${active ? "text-brand border-r-[2px] border-brand" : "text-primary-dark border-r-[2px] border-transparent hover:border-brand"}
    `}
  >
    <img
      src={active ? activeIcon : icon}
      className="w-6 h-6 transition-all group-hover:hidden"
      alt=""
    />
    <img
      src={activeIcon}
      className="w-6 h-6 transition-all hidden group-hover:block"
      alt=""
    />

    <span
      className={`
        text-lg font-bold font-inter transition-all
        ${active ? "text-brand" : "text-primary-dark group-hover:text-brand"}
      `}
    >
      {label}
    </span>
  </Link>
);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();

  const mainMenu = [
    { label: "Home", href: "/user/dashboard", icon: Home, activeIcon: RedHome },
    { label: "Appointments", href: "/user/appointments", icon: Calendar, activeIcon: RedCalendar },
    // { label: "Groomers", href: "/user/groomers", icon: Scissor, activeIcon: RedScissor },
    { label: "My Pets", href: "/user/pet/list", icon: Scissor, activeIcon: RedScissor },
    { label: "Inbox", href: "/user/inbox", icon: Inbox, activeIcon: RedInbox },
    { label: "My Account", href: "/user/account", icon: User, activeIcon: RedUser },
  ];

  const secondaryMenu = [
    { label: "How It Works", href: "https://www.groomit.me/how-it-works", icon: HelpCircle, activeIcon: RedHelpCircle },
    { label: "Review Us", href: "https://g.page/r/CcYk6tuuu6NhEB0/review", icon: Star, activeIcon: RedStar },
  ];

  const handleLogout = async () => {
    showLoader();
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logout successful 🎉");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="hidden md:flex">
      <div className="w-[265px] bg-white border-r border-[#BEC3C5] flex flex-col h-full pl-8 pb-6">

        {/* Main Menu */}
        <div className="flex flex-col">
          {mainMenu.map((item) => {
            let isActive = location.pathname === item.href;

            if (item.label === "Appointments") {
              isActive =
                location.pathname.startsWith("/user/appointments") ||
                location.pathname.startsWith("/user/view-rebook-confirmation-session/") ||
                location.pathname.startsWith("/user/appointment/");
            }

            if (item.label === "My Pets") {
              isActive = location.pathname.startsWith("/user/pet/");
            }

            if (item.label === "My Account") {
              isActive = location.pathname.startsWith("/user/account");
            }

            return (
              <SidebarItem
                key={item.label}
                {...item}
                active={isActive}
                onClick={() => dispatch(clearSelectedChat())}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-[#E4E4E4] w-full"></div>

        {/* Secondary Menu */}
        <div className="flex flex-col">
          {secondaryMenu.map((item) => (
            <SidebarItem target="_blank" key={item.label} {...item} onClick={() => dispatch(clearSelectedChat())} />
          ))}
        </div>

        {/* App Downloads */}
        <div className="space-y-4 pt-6">
          <p className="font-inter font-normal text-sm text-primary-dark mb-3">Download the App</p>
          <div className="flex flex-col gap-3">
            <a href="https://www.groomit.me/download-groomit-app" target="_blank" rel="noopener noreferrer">
              <img src={PlayStore} alt="Google Play" className="h-[36px]" />
            </a>
            <a href="https://www.groomit.me/download-groomit-app" target="_blank" rel="noopener noreferrer">
              <img src={AppStore} alt="App Store" className="h-[36px]" />
            </a>
          </div>
        </div>

        {/* Logout */}
        <div>
          <SidebarItem label="Logout" activeIcon={LogOut} icon={LogOut} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
