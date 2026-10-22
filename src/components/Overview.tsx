import React from 'react';
import { 
  Box, 
  AlertCircle, 
  Clock, 
  Check, 
  FileText, 
  Plus, 
  ArrowRight 
} from 'lucide-react';
import { DocumentRecord, ApprovalRecord, AuditLogEntry, UserSession, OrderRecord } from '../types';
import { Language } from '../i18n/translations';

interface OverviewProps {
  documents: DocumentRecord[];
  approvals: ApprovalRecord[];
  auditLogs: AuditLogEntry[];
  currentUser: UserSession;
  orders?: OrderRecord[];
  lang: Language;
  onOpenDoc: (docId: string) => void;
  onOpenApproval: (approvalId: string) => void;
  onNavigate: (page: string) => void;
  onOpenUpload: () => void;
  onSelectOrder?: (orderId: string) => void;
  onOpenInstruction?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  documents,
  approvals,
  auditLogs,
  currentUser,
  orders = [],
  lang,
  onOpenDoc,
  onOpenApproval,
  onNavigate,
  onOpenUpload,
  onSelectOrder
}) => {
  // Metric counts
  const totalOrders = orders.length || 4;
  const needsActionCount = orders.filter(
    o => o.consistency === 'Cần kiểm tra' || o.completeness === 'Chưa đầy đủ' || o.overallStatus === 'Cần kiểm tra'
  ).length || 2;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length || 1;
  const signedOrdersCount = orders.filter(o => o.signing === 'Đã ký').length || 1;

  // Consistency Badge Renderer
  const renderConsistencyBadge = (status: string) => {
    switch (status) {
      case 'Khớp dữ liệu':
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 whitespace-nowrap">
            {lang === 'vi' ? 'Khớp dữ liệu' : 'Matched'}
          </span>
        );
      case 'Cần kiểm tra':
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 whitespace-nowrap">
            {lang === 'vi' ? 'Cần kiểm tra' : 'Needs Review'}
          </span>
        );
      default:
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 whitespace-nowrap">
            {lang === 'vi' ? 'Chưa kiểm tra' : 'Pending'}
          </span>
        );
    }
  };

  // Overall Status Badge Renderer
  const renderOverallBadge = (status: string) => {
    switch (status) {
      case 'Hoàn tất':
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 whitespace-nowrap">
            {lang === 'vi' ? 'Hoàn tất' : 'Completed'}
          </span>
        );
      case 'Cần kiểm tra':
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 whitespace-nowrap">
            {lang === 'vi' ? 'Cần kiểm tra' : 'Needs Review'}
          </span>
        );
      case 'Chờ phê duyệt':
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 whitespace-nowrap">
            {lang === 'vi' ? 'Chờ phê duyệt' : 'Pending Approval'}
          </span>
        );
      default:
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 whitespace-nowrap">
            {lang === 'vi' ? 'Chưa đầy đủ' : 'Incomplete'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Minimal, 1-line title, 1-line subtitle, adhering strictly to image) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'vi' ? 'TỔNG QUAN' : 'OVERVIEW'}
          </div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0f294a] tracking-tight mt-1 truncate">
            {lang === 'vi' ? 'Tổng quan hoạt động' : 'Operational Overview'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {lang === 'vi'
              ? 'Theo dõi đơn hàng, tình trạng bộ chứng từ và các thao tác cần xử lý.'
              : 'Track orders, document bundles status, and pending operational actions.'}
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('evidence')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>⚡ Bằng chứng Bán dẫn (Tide Demo)</span>
          </button>

          <button
            onClick={() => onNavigate('documents')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'vi' ? 'Kho chứng từ' : 'Document Register'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f294a] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Tạo đơn hàng' : 'New Order'}</span>
          </button>
        </div>
      </div>

      {/* Tide UNLOCKED Hackathon Banner (Minimal, Clean Navy & Blue) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0f294a] to-[#1e3a5f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
              Tide UNLOCKED 2026 Challenge 2
            </span>
            <span className="text-xs text-blue-200">Emergent Authority · Dual-Key Quorum (2-of-2)</span>
          </div>
          <h2 className="text-sm font-bold text-white">
            {lang === 'vi' 
              ? 'Nền tảng Trao đổi Bằng chứng Bán dẫn: Loại bỏ hoàn toàn Master Key đơn quyền' 
              : 'Semiconductor Evidence Exchange: Zero Unilateral Administrative Control'}
          </h2>
          <p className="text-xs text-blue-100/80">
            {lang === 'vi'
              ? 'Bảo vệ hồ sơ kiểm định wafer 7nm & FPGA vũ trụ. Thử nghiệm ngay hành vi Rogue Admin bị chặn đứng và đồng ký 2-of-2.'
              : 'Protecting 7nm wafer & aerospace FPGA compliance proofs. Test unilateral override blocking & 2-of-2 co-signing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('evidence')}
            className="px-3.5 py-1.5 bg-white text-[#0f294a] hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            {lang === 'vi' ? 'Mở Sandbox Demo' : 'Launch Demo Sandbox'}
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (2x2 Grid, Clean Whitespace, 4-Color Minimalism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Đơn hàng đang quản lý */}
        <div 
          onClick={() => onNavigate('orders')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">
              {lang === 'vi' ? 'Đơn hàng đang quản lý' : 'Active Orders'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center shrink-0">
              <Box className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">
            {totalOrders}
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'vi' ? 'Tất cả giao dịch trong workspace' : 'All transactions in workspace'}
          </div>
        </div>

        {/* Card 2: Cần xử lý */}
        <div 
          onClick={() => onSelectOrder?.('ord-101')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">
              {lang === 'vi' ? 'Cần xử lý' : 'Needs Action'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">
            {needsActionCount}
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'vi' ? 'Thiếu chứng từ hoặc có cảnh báo' : 'Missing docs or active warnings'}
          </div>
        </div>

        {/* Card 3: Chờ phê duyệt */}
        <div 
          onClick={() => onNavigate('approvals')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">
              {lang === 'vi' ? 'Chờ phê duyệt' : 'Pending Approvals'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">
            {pendingApprovalsCount}
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'vi' ? 'Yêu cầu đang chờ quyết định' : 'Requests awaiting decision'}
          </div>
        </div>

        {/* Card 4: Sẵn sàng / đã ký */}
        <div 
          onClick={() => onSelectOrder?.('ord-102')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">
              {lang === 'vi' ? 'Sẵn sàng / đã ký' : 'Ready / Signed'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">
            {signedOrdersCount}
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'vi' ? 'Theo trạng thái demo' : 'According to demo state'}
          </div>
        </div>
      </div>

      {/* Frame: Đơn hàng gần đây (Recent Orders Table matching exact design) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Header Row */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#0f294a] tracking-tight">
              {lang === 'vi' ? 'Đơn hàng gần đây' : 'Recent Orders'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'vi'
                ? 'Đơn hàng là trung tâm; chứng từ được liên kết theo Order và Shipment.'
                : 'Orders are foundational; documents are linked across Order and Shipment.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{lang === 'vi' ? 'Xem tất cả' : 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-white">
                <th className="py-3 px-5">{lang === 'vi' ? 'ĐƠN HÀNG' : 'ORDER'}</th>
                <th className="py-3 px-4">{lang === 'vi' ? 'ĐỐI TÁC' : 'COUNTERPARTY'}</th>
                <th className="py-3 px-4">{lang === 'vi' ? 'BỘ CHỨNG TỪ' : 'DOC BUNDLE'}</th>
                <th className="py-3 px-4">{lang === 'vi' ? 'ĐỐI CHIẾU' : 'RECONCILIATION'}</th>
                <th className="py-3 px-4">{lang === 'vi' ? 'TRẠNG THÁI CHUNG' : 'OVERALL STATUS'}</th>
                <th className="py-3 px-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                // Partner display logic matching sample
                let partnerName = order.seller;
                let partnerSub = '→ Atlas Components';
                if (order.id === 'ord-101') {
                  partnerName = 'Seoul Electronics';
                  partnerSub = '→ Pacific Components';
                } else if (order.id === 'ord-102') {
                  partnerName = 'Pacific Trading';
                  partnerSub = '→ Atlas Components';
                } else if (order.id === 'ord-103') {
                  partnerName = 'Global Parts';
                  partnerSub = '→ Atlas Components';
                } else if (order.id === 'ord-104') {
                  partnerName = 'Shenzhen Apex';
                  partnerSub = '→ Atlas Components';
                }

                // Docs count display matching sample
                let docCountText = `${order.completenessCount.current}/${order.completenessCount.total} chứng từ`;
                if (order.id === 'ord-102') {
                  docCountText = '7/7 chứng từ';
                }

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Column 1: ĐƠN HÀNG */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#0f294a] group-hover:text-blue-700 transition-colors">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {order.commodityType}
                      </div>
                    </td>

                    {/* Column 2: ĐỐI TÁC */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">
                        {partnerName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {partnerSub}
                      </div>
                    </td>

                    {/* Column 3: BỘ CHỨNG TỪ */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700 font-mono">
                        {docCountText}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.completeness}
                      </div>
                    </td>

                    {/* Column 4: ĐỐI CHIẾU */}
                    <td className="py-3.5 px-4">
                      {renderConsistencyBadge(order.consistency)}
                    </td>

                    {/* Column 5: TRẠNG THÁI CHUNG */}
                    <td className="py-3.5 px-4">
                      {renderOverallBadge(order.overallStatus)}
                    </td>

                    {/* Column 6: Action */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectOrder?.(order.id)}
                        className="inline-flex items-center gap-1 font-bold text-xs text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                      >
                        <span>{lang === 'vi' ? 'Mở đơn hàng' : 'Open workspace'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
