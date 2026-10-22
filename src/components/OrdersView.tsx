import React, { useState, useMemo } from 'react';
import { 
  OrderRecord, 
  OrderCompletenessStatus, 
  OrderConsistencyStatus, 
  OrderApprovalStatus, 
  OrderSigningStatus,
  OrderOverallStatus
} from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface OrdersViewProps {
  orders: OrderRecord[];
  lang: Language;
  onSelectOrder: (orderId: string) => void;
  onOpenInstruction: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  lang,
  onSelectOrder,
  onOpenInstruction,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterConsistency, setFilterConsistency] = useState<string>('ALL');
  const [filterApproval, setFilterApproval] = useState<string>('ALL');
  const [filterCompleteness, setFilterCompleteness] = useState<string>('ALL');

  const t = TRANSLATIONS[lang];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.commodityType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchConsistency = filterConsistency === 'ALL' || order.consistency === filterConsistency;
      const matchApproval = filterApproval === 'ALL' || order.approval === filterApproval;
      const matchCompleteness = filterCompleteness === 'ALL' || order.completeness === filterCompleteness;

      return matchSearch && matchConsistency && matchApproval && matchCompleteness;
    });
  }, [orders, searchQuery, filterConsistency, filterApproval, filterCompleteness]);

  // Aggregate Metrics
  const totalOrders = orders.length;
  const discrepancyOrders = orders.filter(o => o.consistency === 'Cần kiểm tra').length;
  const pendingApprovalOrders = orders.filter(o => o.approval === 'Chờ phê duyệt').length;
  const completedOrders = orders.filter(o => o.overallStatus === 'Hoàn tất').length;

  // Badge helpers
  const getOverallBadge = (status: OrderOverallStatus) => {
    switch (status) {
      case 'Cần kiểm tra':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Chưa đầy đủ':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Chờ phê duyệt':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Chờ ký':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hoàn tất':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getConsistencyBadge = (status: OrderConsistencyStatus) => {
    switch (status) {
      case 'Cần kiểm tra':
        return 'text-rose-700 bg-rose-50 border-rose-200 font-bold';
      case 'Khớp dữ liệu':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Đang kiểm tra':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Đã xử lý sai lệch':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getApprovalBadge = (status: OrderApprovalStatus) => {
    switch (status) {
      case 'Chờ phê duyệt':
        return 'text-amber-700 bg-amber-50 border-amber-200 font-bold';
      case 'Đã phê duyệt':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Yêu cầu chỉnh sửa':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSigningBadge = (status: OrderSigningStatus) => {
    switch (status) {
      case 'Đã ký':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Chờ ký':
        return 'text-purple-700 bg-purple-50 border-purple-200 font-bold';
      case 'Không yêu cầu ký':
        return 'text-slate-500 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'vi' ? 'Sổ Lệnh & Không Gian Đơn Hàng' : 'Orders & Commercial Workspaces'}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {orders.length} {lang === 'vi' ? 'đơn' : 'orders'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'vi'
              ? 'Quản trị tập trung theo luồng Order → Shipment → Documents với ma trận 4 chiều độc lập.'
              : 'Unified management across Order → Shipment → Documents with 4 independent status dimensions.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Instruction CTA */}
          <button
            onClick={onOpenInstruction}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'vi' ? 'Hướng Dẫn Người Mới' : 'Quick Guide'}</span>
          </button>

          {/* Create Order button */}
          <button
            onClick={() => onShowToast(
              lang === 'vi' ? 'Khởi tạo đơn hàng mới' : 'Create Order',
              lang === 'vi' ? 'Hệ thống đã chuẩn bị mẫu đơn hàng mới ORD-2026-005 với checklist tự động.' : 'New order draft ORD-2026-005 prepared with automated checklist.',
              'info'
            )}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Tạo Đơn Hàng' : 'New Order'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>{lang === 'vi' ? 'Tổng Đơn Hàng' : 'Total Orders'}</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalOrders}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'vi' ? 'Tất cả các lô hàng đang lưu' : 'All active commerce contracts'}
          </div>
        </div>

        {/* Discrepancies */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span className="text-rose-700">{lang === 'vi' ? 'Cần Kiểm Tra Sai Lệch' : 'Flagged Discrepancies'}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{discrepancyOrders}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'vi' ? 'AI phát hiện lệch số lượng/đơn giá' : 'AI detected qty/price mismatch'}
          </div>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span className="text-amber-700">{lang === 'vi' ? 'Chờ Phê Duyệt' : 'Pending Approvals'}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{pendingApprovalOrders}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'vi' ? 'Cần Maker-Checker thẩm định' : 'Awaiting Maker-Checker sign-off'}
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span className="text-emerald-700">{lang === 'vi' ? 'Đã Hoàn Tất & Đã Ký' : 'Completed & Signed'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{completedOrders}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'vi' ? 'Hồ sơ đầy đủ & đã khóa chữ ký' : 'Full checklist & verified seals'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'vi' 
                ? 'Tìm kiếm theo mã đơn (ORD-...), bên bán, bên mua, loại hàng...' 
                : 'Search by Order ID, seller, buyer, commodity...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Consistency Filter */}
            <select
              value={filterConsistency}
              onChange={(e) => setFilterConsistency(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">{lang === 'vi' ? 'Tất cả đối chiếu' : 'All Reconciliation'}</option>
              <option value="Cần kiểm tra">{lang === 'vi' ? '⚠️ Cần kiểm tra' : '⚠️ Needs Review'}</option>
              <option value="Khớp dữ liệu">{lang === 'vi' ? '✓ Khớp dữ liệu' : '✓ Matched'}</option>
              <option value="Chưa kiểm tra">{lang === 'vi' ? '○ Chưa kiểm tra' : '○ Not Checked'}</option>
              <option value="Đã xử lý sai lệch">{lang === 'vi' ? '✓ Đã xử lý sai lệch' : '✓ Resolved'}</option>
            </select>

            {/* Approval Filter */}
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">{lang === 'vi' ? 'Tất cả phê duyệt' : 'All Approvals'}</option>
              <option value="Chờ phê duyệt">{lang === 'vi' ? '⏳ Chờ phê duyệt' : '⏳ Pending'}</option>
              <option value="Đã phê duyệt">{lang === 'vi' ? '✓ Đã phê duyệt' : '✓ Approved'}</option>
              <option value="Chưa gửi">{lang === 'vi' ? 'Draft / Chưa gửi' : 'Draft'}</option>
            </select>

            {/* Completeness Filter */}
            <select
              value={filterCompleteness}
              onChange={(e) => setFilterCompleteness(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">{lang === 'vi' ? 'Tất cả checklist' : 'All Checklist'}</option>
              <option value="Đầy đủ">{lang === 'vi' ? '✓ Đầy đủ' : '✓ Complete'}</option>
              <option value="Chưa đầy đủ">{lang === 'vi' ? '○ Chưa đầy đủ' : '○ Incomplete'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">{lang === 'vi' ? 'Đơn Hàng / Tiêu Đề' : 'Order / Subject'}</th>
                <th className="py-3.5 px-4">{lang === 'vi' ? 'Bên Bán (Seller)' : 'Seller'}</th>
                <th className="py-3.5 px-4">{lang === 'vi' ? 'Giá Trị / Điều Kiện' : 'Value / Terms'}</th>
                <th className="py-3.5 px-3 text-center">{lang === 'vi' ? 'Tiến Độ' : 'Checklist'}</th>
                <th className="py-3.5 px-3">{lang === 'vi' ? '1. Đầy Đủ' : '1. Complete'}</th>
                <th className="py-3.5 px-3">{lang === 'vi' ? '2. Đối Chiếu (AI)' : '2. Consistency'}</th>
                <th className="py-3.5 px-3">{lang === 'vi' ? '3. Phê Duyệt' : '3. Approval'}</th>
                <th className="py-3.5 px-3">{lang === 'vi' ? '4. Ký Số' : '4. Signing'}</th>
                <th className="py-3.5 px-3 text-center">{lang === 'vi' ? 'Tổng Hợp' : 'Overall'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'vi' ? 'Thao Tác' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <div>{lang === 'vi' ? 'Không tìm thấy đơn hàng phù hợp bộ lọc.' : 'No orders matched your filters.'}</div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const percent = Math.round((order.completenessCount.current / order.completenessCount.total) * 100);

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectOrder(order.id)}
                    >
                      {/* Order info */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-blue-900 group-hover:text-blue-700 flex items-center gap-1.5 font-mono text-xs">
                          <span>{order.orderNumber}</span>
                          {order.consistency === 'Cần kiểm tra' && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                          )}
                        </div>
                        <div className="text-slate-900 font-bold truncate max-w-xs mt-0.5" title={order.title}>
                          {order.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {order.commodityType} · {order.contractQuantity.toLocaleString()} {order.unit}
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{order.seller}</div>
                        <div className="text-[11px] text-slate-400">Mua bởi: {order.buyer}</div>
                      </td>

                      {/* Value / Terms */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          {order.currency} ${order.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {order.incoterms}
                        </div>
                      </td>

                      {/* Checklist Progress */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {order.completenessCount.current}/{order.completenessCount.total}
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div 
                              className={`h-full ${percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Dimension 1: Completeness */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block text-[11px] font-medium text-slate-700">
                          {order.completeness}
                        </span>
                      </td>

                      {/* Dimension 2: Consistency */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getConsistencyBadge(order.consistency)}`}>
                          {order.consistency}
                        </span>
                      </td>

                      {/* Dimension 3: Approval */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getApprovalBadge(order.approval)}`}>
                          {order.approval}
                        </span>
                      </td>

                      {/* Dimension 4: Signing */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getSigningBadge(order.signing)}`}>
                          {order.signing}
                        </span>
                      </td>

                      {/* Overall Rollup */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${getOverallBadge(order.overallStatus)}`}>
                          {order.overallStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold text-xs transition-colors"
                        >
                          <span>{lang === 'vi' ? 'Mở hồ sơ' : 'Open'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
