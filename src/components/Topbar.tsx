import React, { useState } from 'react';
import { 
  Menu, 
  ChevronDown, 
  Languages, 
  BookOpen,
  Shield
} from 'lucide-react';
import { UserSession } from '../types';
import { USERS } from '../data/initialData';
import { Language } from '../i18n/translations';

interface TopbarProps {
  currentPage: string;
  currentUser: UserSession;
  lang: Language;
  onSwitchUser: (user: UserSession) => void;
  onToggleLanguage: (lang: Language) => void;
  onOpenUpload: () => void;
  onOpenNotifications: () => void;
  onOpenInstruction?: () => void;
  onOpenTideModal?: () => void;
  onOpenTideAuthModal?: () => void;
  onOpenScenarios?: () => void;
  onOpenArchitecture?: () => void;
  onOpenSubmissionKit?: () => void;
  onNavigateHome?: () => void;
  onToggleMobileMenu: () => void;
  pendingApprovalsCount: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  currentUser,
  lang,
  onSwitchUser,
  onToggleLanguage,
  onOpenUpload,
  onOpenNotifications,
  onOpenInstruction,
  onOpenTideModal,
  onOpenTideAuthModal,
  onOpenScenarios,
  onOpenArchitecture,
  onOpenSubmissionKit,
  onNavigateHome,
  onToggleMobileMenu,
  pendingApprovalsCount
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getPageBreadcrumb = (page: string) => {
    switch (page) {
      case 'overview': return lang === 'vi' ? 'Tổng quan' : 'Overview';
      case 'evidence': return lang === 'vi' ? 'Bằng chứng Bán dẫn' : 'Semiconductor Evidence';
      case 'orders': return lang === 'vi' ? 'Đơn hàng' : 'Orders';
      case 'order-detail': return lang === 'vi' ? 'Chi tiết đơn hàng' : 'Order Detail';
      case 'shipments': return lang === 'vi' ? 'Lô hàng' : 'Shipments';
      case 'documents': return lang === 'vi' ? 'Kho chứng từ' : 'Documents';
      case 'approvals': return lang === 'vi' ? 'Hàng đợi phê duyệt' : 'Approvals';
      case 'counterparties': return lang === 'vi' ? 'Đối tác' : 'Counterparties';
      case 'policies': return lang === 'vi' ? 'Chính sách truy cập' : 'Access Policies';
      case 'audit': return lang === 'vi' ? 'Nhật ký kiểm toán' : 'Audit Trail';
      case 'tide-security': return lang === 'vi' ? 'Bảo mật TideCloak' : 'TideCloak Security';
      default: return page;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left side: mobile toggle + clean minimal breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center text-sm font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            CargoTrust
          </button>
          <span className="text-slate-300 mx-2">/</span>
          <span className="font-bold text-[#0f294a] truncate">
            {getPageBreadcrumb(currentPage)}
          </span>
        </div>
      </div>

      {/* Right side: Clean minimal actions adhering to 4-color tone */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Prototype status indicator matching design */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium mr-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{lang === 'vi' ? 'Prototype đang hoạt động' : 'Prototype active'}</span>
        </div>

        {/* User Onboarding Guide Button (Prominent next to Language Switcher) */}
        {onOpenInstruction && (
          <button
            onClick={onOpenInstruction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-xs font-semibold text-blue-700 transition-colors shadow-2xs cursor-pointer"
            title={lang === 'vi' ? 'Xem hướng dẫn sử dụng cho người mới' : 'View new user onboarding guide'}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'vi' ? 'Hướng dẫn' : 'Guide'}</span>
          </button>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => onToggleLanguage(lang === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          <Languages className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
        </button>

        {/* TideCloak Sign-In & Roles Simulator Button */}
        {onOpenTideAuthModal && (
          <button
            onClick={onOpenTideAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/90 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition-colors shadow-2xs cursor-pointer"
            title={lang === 'vi' ? 'Mô phỏng xác thực & phân quyền TideCloak' : 'Simulate TideCloak Sign-in & Roles'}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">TideCloak Auth</span>
            <span className="sm:hidden">Auth</span>
          </button>
        )}

        {/* Minimal Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 cursor-pointer shadow-2xs"
            title={lang === 'vi' ? 'Đổi vai trò kiểm thử' : 'Switch demo persona'}
          >
            <div className="w-5 h-5 rounded-full bg-[#0f294a] text-white font-bold text-[10px] flex items-center justify-center">
              {currentUser.avatar}
            </div>
            <span className="hidden sm:inline font-bold text-[#0f294a]">{currentUser.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsRoleDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'vi' ? 'CHỌN VAI TRÒ KIỂM THỬ' : 'SWITCH DEMO PERSONA'}
                </div>
                <div className="p-1 space-y-0.5">
                  {Object.values(USERS).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left cursor-pointer
                        ${currentUser.id === user.id ? 'bg-[#edf4fc] text-[#0f294a] font-bold' : 'hover:bg-slate-50 text-slate-700'}
                      `}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate">{user.name}</div>
                        <div className="text-[10.5px] text-slate-400 truncate">{user.role}</div>
                      </div>
                      {currentUser.id === user.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
