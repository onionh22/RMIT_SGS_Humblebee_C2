import React from 'react';
import { 
  ArrowLeftRight, 
  LayoutGrid, 
  Box, 
  MoveRight, 
  FileText, 
  Search, 
  Clock, 
  ShieldCheck, 
  Users, 
  ListCheck, 
  Diamond, 
  ChevronDown
} from 'lucide-react';
import { UserSession } from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  orderCount?: number;
  documentCount: number;
  approvalCount: number;
  currentUser: UserSession;
  lang: Language;
  onOpenTideModal?: () => void;
  onOpenInstruction?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  orderCount = 4,
  documentCount = 6,
  approvalCount = 1,
  currentUser,
  lang,
  onOpenTideModal,
  onOpenInstruction,
  isOpenMobile,
  onCloseMobile
}) => {
  const t = TRANSLATIONS[lang];

  const handleNavClick = (id: string) => {
    onPageChange(id);
    onCloseMobile();
  };

  const navItems = [
    { 
      id: 'overview', 
      label: lang === 'vi' ? 'Tổng quan' : 'Overview', 
      icon: LayoutGrid 
    },
    { 
      id: 'evidence', 
      label: lang === 'vi' ? 'Bằng chứng Bán dẫn' : 'Semiconductor Evidence', 
      icon: ShieldCheck,
      badge: '2-of-2'
    },
    { 
      id: 'orders', 
      label: lang === 'vi' ? 'Đơn hàng' : 'Orders', 
      icon: Box, 
      count: '04' 
    },
    { 
      id: 'shipments', 
      label: lang === 'vi' ? 'Lô hàng' : 'Shipments', 
      icon: MoveRight 
    },
    { 
      id: 'documents', 
      label: lang === 'vi' ? 'Kho chứng từ' : 'Documents', 
      icon: FileText 
    },
    { 
      id: 'ai-review', 
      label: lang === 'vi' ? 'AI rà soát' : 'AI Review', 
      icon: Search, 
      badge: '02' 
    },
    { 
      id: 'approvals', 
      label: lang === 'vi' ? 'Hàng đợi phê duyệt' : 'Approvals', 
      icon: Clock, 
      badge: '01' 
    },
  ];

  const govItems = [
    { 
      id: 'policies', 
      label: lang === 'vi' ? 'Chính sách truy cập' : 'Access Policies', 
      icon: ShieldCheck 
    },
    { 
      id: 'counterparties', 
      label: lang === 'vi' ? 'Đối tác' : 'Counterparties', 
      icon: Users 
    },
    { 
      id: 'audit', 
      label: lang === 'vi' ? 'Nhật ký kiểm toán' : 'Audit Trail', 
      icon: ListCheck 
    },
    { 
      id: 'tide-security', 
      label: lang === 'vi' ? 'Bảo mật TideCloak' : 'TideCloak Security', 
      icon: Diamond,
      badge: 'Nodes'
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-3 text-left w-full hover:opacity-90 transition-opacity cursor-pointer group"
            title={lang === 'vi' ? 'Về trang chủ Tổng quan' : 'Return to Overview'}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0f294a] flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#0f294a]">
                CargoTrust
              </div>
              <div className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                TRADE DOCUMENT CONTROL
              </div>
            </div>
          </button>
        </div>

        {/* Workspace selector */}
        <div className="px-4 py-3">
          <div className="p-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                AC
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Atlas Components</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {lang === 'vi' ? 'Không gian làm việc' : 'Workspace'}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Nav lists */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Section 1: Không gian làm việc */}
          <div>
            <div className="px-3 mb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'vi' ? 'KHÔNG GIAN LÀM VIỆC' : 'WORKSPACE'}
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || (item.id === 'ai-review' && currentPage === 'order-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'ai-review') {
                        handleNavClick('orders');
                      } else {
                        handleNavClick(item.id);
                      }
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl transition-all text-left cursor-pointer
                      ${isActive 
                        ? 'bg-[#edf4fc] text-[#0f294a] font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0f294a]' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.count && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Quản trị & Bảo mật */}
          <div>
            <div className="px-3 mb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'vi' ? 'QUẢN TRỊ & BẢO MẬT' : 'GOVERNANCE & SECURITY'}
            </div>
            <nav className="space-y-1">
              {govItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl transition-all text-left cursor-pointer
                      ${isActive 
                        ? 'bg-[#edf4fc] text-[#0f294a] font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0f294a]' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Minimal Bottom Quick Actions (Instruction & Persona) */}
        <div className="p-3 border-t border-slate-100 bg-white space-y-2">
          {onOpenInstruction && (
            <button
              onClick={onOpenInstruction}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>{lang === 'vi' ? '📘 Hướng dẫn sử dụng' : '📘 User Guide'}</span>
              <span className="text-[10px] text-slate-400 font-bold">INFO</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50/70 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center shrink-0">
              {currentUser.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-[10.5px] text-slate-400 truncate">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
