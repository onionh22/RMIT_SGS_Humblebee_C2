import React, { useState } from 'react';
import { 
  OrderRecord, 
  DocumentRecord, 
  ApprovalRecord, 
  AuditLogEntry, 
  UserSession, 
  PolicyRule, 
  OrderChecklistItem 
} from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { evaluateActionPolicy } from '../utils/policyEngine';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  History, 
  ExternalLink, 
  Layers, 
  Ship, 
  Calendar, 
  DollarSign, 
  Building, 
  Info,
  Check,
  XCircle,
  FileCheck,
  RotateCcw,
  KeyRound,
  UserCheck
} from 'lucide-react';

interface OrderWorkspaceViewProps {
  order: OrderRecord;
  allDocuments: DocumentRecord[];
  allApprovals: ApprovalRecord[];
  allAuditLogs: AuditLogEntry[];
  currentUser: UserSession;
  policies: PolicyRule[];
  lang: Language;
  onBack: () => void;
  onOpenDoc: (docId: string) => void;
  onUpdateOrder: (updatedOrder: OrderRecord) => void;
  onUpdateApproval: (updatedApproval: ApprovalRecord) => void;
  onAddAuditLog: (event: string, detail: string, result: 'Success' | 'Exception flagged' | 'Blocked by policy' | 'Signed', tone?: 'green' | 'red' | 'amber') => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  initialTab?: string;
}

export const OrderWorkspaceView: React.FC<OrderWorkspaceViewProps> = ({
  order,
  allDocuments,
  allApprovals,
  allAuditLogs,
  currentUser,
  policies,
  lang,
  onBack,
  onOpenDoc,
  onUpdateOrder,
  onUpdateApproval,
  onAddAuditLog,
  onShowToast,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSigningProcessing, setIsSigningProcessing] = useState(false);
  const [exceptionNote, setExceptionNote] = useState('');
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  const t = TRANSLATIONS[lang];

  // Linked items
  const linkedApprovals = allApprovals.filter(a => a.orderId === order.id || a.title.includes(order.orderNumber));
  const linkedAuditLogs = allAuditLogs.filter(log => 
    log.orderId === order.id || 
    (log.detail && log.detail.includes(order.orderNumber))
  );

  // Status badges
  const getOverallBadge = (status: string) => {
    switch (status) {
      case 'Cần kiểm tra': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Chưa đầy đủ': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Chờ phê duyệt': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Chờ ký': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hoàn tất': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Handle Approving Exception
  const handleApprove = (approval: ApprovalRecord) => {
    // Policy check
    const policyResult = evaluateActionPolicy(
      'APPROVE_EXCEPTION',
      currentUser,
      approval.requesterId,
      approval.amount,
      policies,
      false,
      order.consistency === 'Cần kiểm tra'
    );

    if (!policyResult.allowed) {
      onShowToast(
        lang === 'vi' ? 'Hành Động Bị Chặn Bởi Chính Sách' : 'Action Blocked by Policy',
        policyResult.reasons[0] || (lang === 'vi' ? 'Bạn không đủ thẩm quyền duyệt.' : 'Insufficient authorization.'),
        'error'
      );
      onAddAuditLog(
        lang === 'vi' ? 'Chặn phê duyệt ngoại lệ' : 'Exception Approval Blocked',
        `User ${currentUser.name} (${currentUser.role}) blocked from approving ${approval.title}. Reason: ${policyResult.reasons.join(', ')}`,
        'Blocked by policy',
        'red'
      );
      return;
    }

    // Success approve
    const updated: ApprovalRecord = {
      ...approval,
      receivedApprovals: approval.receivedApprovals + 1,
      status: (approval.receivedApprovals + 1) >= approval.requiredApprovals ? 'Approved' : 'Pending',
      approvers: [
        ...approval.approvers,
        {
          userId: currentUser.id,
          userName: currentUser.name,
          role: currentUser.role,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          note: lang === 'vi' ? 'Phê duyệt dung sai theo quy chuẩn' : 'Tolerance approved under trade policy'
        }
      ]
    };

    onUpdateApproval(updated);

    // Update order status if fully approved
    if (updated.status === 'Approved') {
      const updatedOrder: OrderRecord = {
        ...order,
        approval: 'Đã phê duyệt',
        overallStatus: order.signing === 'Đã ký' ? 'Hoàn tất' : 'Chờ ký'
      };
      onUpdateOrder(updatedOrder);
    }

    onShowToast(
      lang === 'vi' ? 'Phê duyệt thành công' : 'Approval Recorded',
      lang === 'vi' ? `Bạn (${currentUser.name}) đã ký duyệt thành công cho yêu cầu.` : `Approved by ${currentUser.name}.`,
      'success'
    );

    onAddAuditLog(
      lang === 'vi' ? 'Phê duyệt ngoại lệ thành công' : 'Exception Approved',
      `Approval recorded by ${currentUser.name} (${currentUser.role}) for order ${order.orderNumber}.`,
      'Success',
      'green'
    );
  };

  // Handle Protected Signing
  const handleSignOrder = () => {
    // Policy check
    const policyResult = evaluateActionPolicy(
      'SIGN_DOCUMENT',
      currentUser,
      order.buyer,
      order.totalValue,
      policies,
      false,
      false
    );

    if (!policyResult.allowed) {
      onShowToast(
        lang === 'vi' ? 'Chặn Ký Duyệt Mật Mã' : 'Signing Blocked',
        policyResult.reasons[0] || (lang === 'vi' ? 'Không đủ thẩm quyền ký số.' : 'Unauthorized to sign.'),
        'error'
      );
      onAddAuditLog(
        lang === 'vi' ? 'Chặn ký số đơn hàng' : 'Order Signing Blocked',
        `User ${currentUser.name} blocked from signing order ${order.orderNumber}. Reason: ${policyResult.reasons.join(', ')}`,
        'Blocked by policy',
        'red'
      );
      return;
    }

    setIsSigningProcessing(true);
    setTimeout(() => {
      setIsSigningProcessing(false);
      const updatedOrder: OrderRecord = {
        ...order,
        signing: 'Đã ký',
        overallStatus: 'Hoàn tất'
      };
      onUpdateOrder(updatedOrder);

      onShowToast(
        lang === 'vi' ? 'Ký duyệt mật mã thành công' : 'Order Cryptographically Signed',
        lang === 'vi' ? 'Bộ chứng từ đơn hàng đã được gắn mã băm SHA-256 và khóa chữ ký số vĩnh viễn.' : 'Order bundle cryptographically sealed under Tide protocol governance.',
        'success'
      );

      onAddAuditLog(
        lang === 'vi' ? 'Ký duyệt bộ chứng từ đơn hàng' : 'Order Bundle Sealed & Signed',
        `Order ${order.orderNumber} bundle cryptographically sealed by ${currentUser.name} (${currentUser.role}) with SHA-256 root hash.`,
        'Signed',
        'green'
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title={lang === 'vi' ? 'Quay lại danh sách đơn hàng' : 'Back to orders'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {order.orderNumber}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${getOverallBadge(order.overallStatus)}`}>
                {order.overallStatus}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5 tracking-tight truncate max-w-xl">
              {order.title}
            </h1>
          </div>
        </div>

        {/* 4 Status Dimensions Quick Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[11px]">
            <span className="text-slate-400 font-medium mr-1.5">{lang === 'vi' ? '1. Đầy đủ:' : '1. Docs:'}</span>
            <span className="font-bold text-slate-800">{order.completenessCount.current}/{order.completenessCount.total}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[11px]">
            <span className="text-slate-400 font-medium mr-1.5">{lang === 'vi' ? '2. Đối chiếu:' : '2. Recon:'}</span>
            <span className={`font-bold ${order.consistency === 'Cần kiểm tra' ? 'text-rose-600' : 'text-emerald-700'}`}>
              {order.consistency}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[11px]">
            <span className="text-slate-400 font-medium mr-1.5">{lang === 'vi' ? '3. Duyệt:' : '3. Approval:'}</span>
            <span className={`font-bold ${order.approval === 'Chờ phê duyệt' ? 'text-amber-600' : 'text-slate-800'}`}>
              {order.approval}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[11px]">
            <span className="text-slate-400 font-medium mr-1.5">{lang === 'vi' ? '4. Ký số:' : '4. Sign:'}</span>
            <span className={`font-bold ${order.signing === 'Đã ký' ? 'text-emerald-700' : 'text-purple-700'}`}>
              {order.signing}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto bg-white px-2 rounded-xl shadow-2xs">
        {[
          { id: 'overview', label: lang === 'vi' ? 'A. Tổng quan & Vận chuyển' : 'A. Overview & Shipment', icon: Layers },
          { id: 'checklist', label: lang === 'vi' ? 'B. Checklist Chứng Từ' : 'B. Document Checklist', icon: FileCheck, badge: `${order.completenessCount.current}/${order.completenessCount.total}` },
          { id: 'ai-review', label: lang === 'vi' ? 'C. AI Đối Chiếu Chéo' : 'C. AI Cross-Review', icon: Sparkles, alert: order.consistency === 'Cần kiểm tra' },
          { id: 'approvals', label: lang === 'vi' ? 'D. Quy Trình Phê Duyệt' : 'D. Approvals & Quorum', icon: UserCheck, count: linkedApprovals.filter(a => a.status === 'Pending').length },
          { id: 'signing', label: lang === 'vi' ? 'E. Cổng Ký Duyệt Mật Mã' : 'E. Cryptographic Signing', icon: Lock },
          { id: 'audit', label: lang === 'vi' ? 'F. Lịch Sử Kiểm Toán' : 'F. Order Audit Trail', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
                ${isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'}
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 rounded text-slate-700">
                  {tab.badge}
                </span>
              )}
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}

      {/* TAB A: OVERVIEW & SHIPMENTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Facts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Commercial terms */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {lang === 'vi' ? 'Điều Khoản Thương Mại' : 'Commercial Terms'}
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Tổng giá trị hợp đồng' : 'Contract Value'}</span>
                  <span className="font-mono font-extrabold text-base text-slate-900">
                    {order.currency} ${order.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Điều kiện Incoterms' : 'Incoterms'}</span>
                  <span className="font-bold text-slate-800">{order.incoterms}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Điều khoản thanh toán' : 'Payment Terms'}</span>
                  <span className="font-bold text-slate-800">{order.paymentTerms}</span>
                </div>
              </div>
            </div>

            {/* Trading Parties */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                {lang === 'vi' ? 'Các Bên Giao Kết' : 'Trading Parties'}
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Bên Mua (Buyer)' : 'Buyer'}</span>
                  <span className="font-bold text-slate-900 block">{order.buyer}</span>
                  <span className="text-[11px] text-slate-500">Mã: AC-VN · TP. Hải Phòng</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Bên Bán (Seller)' : 'Seller'}</span>
                  <span className="font-bold text-slate-900 block">{order.seller}</span>
                  <span className="text-[11px] text-slate-500">Seoul, Hàn Quốc · Đối tác xác minh</span>
                </div>
              </div>
            </div>

            {/* Commodity & Delivery */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                {lang === 'vi' ? 'Hàng Hóa & Tiến Độ' : 'Commodity & Delivery'}
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Loại hàng hóa' : 'Commodity'}</span>
                  <span className="font-bold text-slate-900">{order.commodityType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Số lượng hợp đồng' : 'Contracted Quantity'}</span>
                  <span className="font-mono font-bold text-slate-800">{order.contractQuantity.toLocaleString()} {order.unit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Ngày đặt hàng & Dự kiến giao' : 'Order Date & ETA'}</span>
                  <span className="font-medium text-slate-700">{order.orderDate} → {order.expectedDelivery}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Shipments Section */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === 'vi' ? 'Đợt Giao Hàng Liên Kết (Shipments)' : 'Linked Logistics Shipments'}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {order.shipments.length} {lang === 'vi' ? 'đợt vận chuyển' : 'shipment(s)'}
              </span>
            </div>

            <div className="space-y-3">
              {order.shipments.map((shp) => (
                <div key={shp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        {shp.shipmentNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {shp.carrier} · {shp.vesselOrFlight}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {shp.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 flex flex-wrap gap-4 mt-2">
                      <span><strong>Tuyến:</strong> {shp.origin} → {shp.destination}</span>
                      <span><strong>Container:</strong> <span className="font-mono">{shp.containerNo || 'N/A'}</span></span>
                      <span><strong>Seal:</strong> <span className="font-mono">{shp.sealNo || 'N/A'}</span></span>
                      <span><strong>Lịch trình:</strong> ETD {shp.etd} · ETA {shp.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                    >
                      {lang === 'vi' ? 'Xem chứng từ đợt này' : 'View Shipment Docs'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: DOCUMENT CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {lang === 'vi'
                ? 'Checklist chứng từ bắt buộc và tùy chọn cho đơn hàng này theo quy chuẩn thương mại quốc tế:'
                : 'Mandated trade document checklist required for legal compliance and financial clearance:'}
            </p>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              {order.completenessCount.current} / {order.completenessCount.total} {lang === 'vi' ? 'Đã tải lên' : 'Uploaded'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">{lang === 'vi' ? 'Loại Chứng Từ' : 'Document Type'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Bắt Buộc?' : 'Mandatory'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Mã Tham Chiếu' : 'Reference Ref'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Tải Lên' : 'Ingestion'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'AI Đối Chiếu' : 'AI Review'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Phê Duyệt' : 'Approval'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Ký Số' : 'Signing'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'vi' ? 'Chi Tiết' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.checklist.map((item, idx) => {
                  const linkedDoc = item.docId ? allDocuments.find(d => d.id === item.docId) : null;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{item.docType}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        {item.required ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            {lang === 'vi' ? 'Bắt buộc' : 'Mandatory'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {lang === 'vi' ? 'Tùy chọn' : 'Optional'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-700">
                        {item.docRef || '—'}
                      </td>

                      <td className="py-3.5 px-3">
                        {item.uploadStatus === 'Đã tải lên' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.uploadStatus}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold">
                            {item.uploadStatus}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        {item.aiReviewStatus === 'Phát hiện sai lệch' ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {item.aiReviewStatus}
                          </span>
                        ) : item.aiReviewStatus === 'Đã kiểm tra' ? (
                          <span className="text-emerald-700 font-semibold">
                            {item.aiReviewStatus}
                          </span>
                        ) : (
                          <span className="text-slate-400">{item.aiReviewStatus}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          item.approvalStatus === 'Đã phê duyệt' ? 'bg-emerald-50 text-emerald-700' :
                          item.approvalStatus === 'Chưa phê duyệt' ? 'bg-amber-50 text-amber-700 font-bold' :
                          'text-slate-400'
                        }`}>
                          {item.approvalStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          item.signingStatus === 'Đã ký' ? 'bg-emerald-50 text-emerald-700' :
                          item.signingStatus === 'Chờ ký' ? 'bg-purple-50 text-purple-700 font-bold' :
                          'text-slate-400'
                        }`}>
                          {item.signingStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {item.docId ? (
                          <button
                            onClick={() => onOpenDoc(item.docId!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold text-xs transition-colors"
                          >
                            <span>{lang === 'vi' ? 'Xem file' : 'Inspect'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onShowToast(
                              lang === 'vi' ? 'Tải lên chứng từ bổ sung' : 'Upload Document',
                              lang === 'vi' ? `Vui lòng sử dụng nút Tải lên ở thanh trên để nạp ${item.docType}.` : `Please upload ${item.docType}.`,
                              'info'
                            )}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800"
                          >
                            {lang === 'vi' ? 'Bổ sung ngay' : 'Upload'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: AI CROSS-DOCUMENT REVIEW */}
      {activeTab === 'ai-review' && (
        <div className="space-y-6">
          {/* AI Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h3 className="text-sm font-bold">
                {lang === 'vi' ? 'AI Đối Chiếu Chéo Đa Chiều (Multi-Way Cross Reconciliation)' : 'AI Cross-Document Reconciliation Engine'}
              </h3>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              {lang === 'vi'
                ? 'Công cụ tự động trích xuất các dòng hàng (line items), đối chiếu số lượng và đơn giá giữa Sales Contract ↔ Purchase Order ↔ Commercial Invoice ↔ Packing List.'
                : 'Automated extraction of line items comparing quantities and unit prices across Contract ↔ PO ↔ Commercial Invoice ↔ Packing List.'}
            </p>
          </div>

          {/* Discrepancies Alert Box if exists */}
          {order.discrepancies.length > 0 ? (
            <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/60 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-rose-950">
                      {lang === 'vi' 
                        ? `Phát hiện ${order.discrepancies.length} điểm sai lệch dữ liệu giữa các chứng từ!` 
                        : `${order.discrepancies.length} cross-document discrepancies detected!`}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 uppercase">
                      CRITICAL VARIANCE
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 mt-1">
                    {lang === 'vi'
                      ? 'Hệ thống đã tự động khóa trạng thái phê duyệt cho đến khi có giải trình hợp lệ hoặc xuất hóa đơn điều chỉnh.'
                      : 'Approval gates are guarded until exceptions are justified or corrective invoices issued.'}
                  </p>
                </div>
              </div>

              {/* Discrepancy details cards */}
              <div className="space-y-3">
                {order.discrepancies.map((disc, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{disc.field}</span>
                      <span className="text-rose-600 font-mono">
                        {disc.sourceA.docName}: {disc.sourceA.value} ⟷ {disc.sourceB.docName}: {disc.sourceB.value}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[11px]">{disc.sourceA.docName}</span>
                        <span className="font-mono font-bold text-slate-900">{disc.sourceA.value}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{disc.sourceB.docName}</span>
                        <span className="font-mono font-bold text-rose-700">{disc.sourceB.value}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic">
                      "{disc.explanation}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Exception Resolution Actions */}
              <div className="pt-2 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  {lang === 'vi' ? 'Bạn muốn xử lý sai lệch này như thế nào?' : 'How would you like to handle this discrepancy?'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onShowToast(
                        lang === 'vi' ? 'Yêu cầu nhà cung cấp sửa hóa đơn' : 'Request Corrective Invoice',
                        lang === 'vi' ? 'Đã gửi thông báo đến Seoul Electronics Ltd. yêu cầu điều chỉnh INV-2408 về 220 chiếc.' : 'Notice sent to seller requesting invoice correction.',
                        'info'
                      );
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                  >
                    {lang === 'vi' ? 'Yêu cầu xuất lại hóa đơn' : 'Request Revised Invoice'}
                  </button>

                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    {lang === 'vi' ? 'Chuyển sang Phê Duyệt Ngoại Lệ' : 'Submit Exception Approval'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  {lang === 'vi' ? 'Tất cả dữ liệu khớp 100% giữa các chứng từ!' : 'All cross-document figures match 100%!'}
                </h4>
                <p className="text-xs text-emerald-900 mt-0.5">
                  {lang === 'vi' ? 'Không phát hiện sai lệch số lượng hay chênh lệch đơn giá nào.' : 'Zero variance detected across all commercial and logistics instruments.'}
                </p>
              </div>
            </div>
          )}

          {/* Line Items Reconciliation Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">
                {lang === 'vi' ? 'Chi Tiết Dòng Hàng Đối Chiếu (Line Items Matrix)' : 'Line Item Cross-Matching Matrix'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {order.contractQuantity} {order.unit} contracted
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-4">{lang === 'vi' ? 'Mã Hàng / Mô Tả' : 'SKU / Description'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'vi' ? 'Số lượng PO' : 'PO Qty'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'vi' ? 'Số lượng Hóa đơn' : 'Inv Qty'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'vi' ? 'Số lượng Packing List' : 'PL Qty'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'vi' ? 'Đơn giá (USD)' : 'Unit Price'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'vi' ? 'Thành tiền' : 'Total'}</th>
                  <th className="py-2.5 px-4 text-center">{lang === 'vi' ? 'Trạng Thái' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">MCU-ARM-M4-168</span>
                    <span className="text-[11px] text-slate-500">{order.commodityType}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                    220 pcs
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 bg-rose-50/50">
                    240 pcs (+20)
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                    240 pcs
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">
                    $83.73
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    $20,094.00
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {lang === 'vi' ? 'Lệch +20 chiếc' : 'Mismatch +20'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: APPROVALS & QUORUM */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {lang === 'vi'
                ? 'Hàng đợi phê duyệt thẩm quyền (Maker-Checker & Quorum). Người tạo không thể tự duyệt.'
                : 'Distributed approval queue and Maker-Checker governance gates.'}
            </p>
            <div className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
              {lang === 'vi' ? 'Vai trò hiện tại của bạn:' : 'Your Active Role:'} <strong>{currentUser.name}</strong> ({currentUser.role})
            </div>
          </div>

          {linkedApprovals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
              <div>{lang === 'vi' ? 'Không có yêu cầu phê duyệt nào đang chờ.' : 'No pending approval requests for this order.'}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedApprovals.map((appr) => {
                const isPending = appr.status === 'Pending';
                const hasApproved = appr.approvers.some(a => a.userId === currentUser.id);

                return (
                  <div key={appr.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {appr.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            appr.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {appr.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{appr.title}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {lang === 'vi' ? 'Người yêu cầu:' : 'Requested by:'} <strong>{appr.requesterName}</strong> · {appr.submittedDate}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700">
                          {lang === 'vi' ? 'Tiến độ biểu quyết:' : 'Quorum Progress:'} {appr.receivedApprovals} / {appr.requiredApprovals}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'vi' ? 'Cần Ops Manager + Finance Director' : 'Requires Dual Sign-off'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong>{lang === 'vi' ? 'Lý do & Giải trình:' : 'Justification:'}</strong> {appr.reason}
                    </div>

                    {/* Approvers recorded */}
                    {appr.approvers.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          {lang === 'vi' ? 'Chữ ký đã phê duyệt:' : 'Recorded Sign-offs:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {appr.approvers.map((a, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              {a.userName} ({a.role}) · {a.timestamp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {isPending && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            onShowToast(
                              lang === 'vi' ? 'Từ chối yêu cầu' : 'Request Rejected',
                              lang === 'vi' ? 'Yêu cầu ngoại lệ đã bị bác bỏ.' : 'Exception request rejected.',
                              'error'
                            );
                          }}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors"
                        >
                          {lang === 'vi' ? 'Từ chối' : 'Reject'}
                        </button>

                        <button
                          onClick={() => handleApprove(appr)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>{lang === 'vi' ? 'Phê Duyệt Với Vai Trò Này' : 'Approve Under Current Role'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB E: CRYPTOGRAPHIC SIGNING CENTER */}
      {activeTab === 'signing' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    {lang === 'vi' ? 'Cổng Ký Duyệt Mật Mã Bảo Vệ (Tide Protocol Gateway)' : 'Tide Cryptographic Signing Gateway'}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.signing === 'Đã ký' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {order.signing}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'vi'
                    ? 'Chữ ký số được khóa vào mã băm SHA-256 của toàn bộ hồ sơ. Bất kỳ sự thay thế tài liệu nào sau đó đều làm vô hiệu hóa chữ ký.'
                    : 'Digital signatures are anchored to the cryptographic hash of the order document bundle.'}
                </p>
              </div>
            </div>

            {/* Cryptographic hash card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {lang === 'vi' ? 'Mã Băm Gốc Hồ Sơ Đơn Hàng (Order Bundle SHA-256):' : 'Order Bundle SHA-256 Root Fingerprint:'}
              </div>
              <div className="text-slate-900 break-all select-all font-semibold bg-white p-2.5 rounded border border-slate-200">
                0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'vi' ? 'Trạng thái tính toàn vẹn: Hợp lệ, không phát hiện can thiệp' : 'Integrity state: Valid, zero tampering detected'}</span>
              </div>
            </div>

            {/* Signing Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {order.signing === 'Đã ký' ? (
                  <span className="text-emerald-700 font-bold">
                    ✓ {lang === 'vi' ? 'Hồ sơ đã được ký duyệt số hợp thức.' : 'Order bundle is fully signed and finalized.'}
                  </span>
                ) : (
                  <span>
                    {lang === 'vi' ? 'Yêu cầu thẩm quyền Quản lý Vận hành hoặc Ban Giám đốc để ký.' : 'Requires authorized role to execute cryptographic signature.'}
                  </span>
                )}
              </div>

              {order.signing !== 'Đã ký' && (
                <button
                  onClick={handleSignOrder}
                  disabled={isSigningProcessing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {isSigningProcessing 
                      ? (lang === 'vi' ? 'Đang xác thực khóa mật mã...' : 'Verifying Key Quorum...') 
                      : (lang === 'vi' ? 'Thực Thi Ký Duyệt Mật Mã' : 'Execute Cryptographic Sign')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB F: ORDER AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {lang === 'vi'
                ? 'Nhật ký kiểm toán ghi lại mọi thay đổi dữ liệu, hành vi đối chiếu, phê duyệt và ký số của đơn hàng này:'
                : 'Immutable audit log tracking all events, discrepancies, approvals and executions for this order:'}
            </p>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              {linkedAuditLogs.length} {lang === 'vi' ? 'bản ghi' : 'events'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
            {linkedAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {lang === 'vi' ? 'Chưa có nhật ký ghi nhận riêng cho đơn hàng này.' : 'No audit entries logged for this order yet.'}
              </div>
            ) : (
              linkedAuditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.tone === 'green' ? 'bg-emerald-500' :
                    log.tone === 'red' ? 'bg-rose-500' :
                    log.tone === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{log.event}</span>
                      <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{log.detail}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>Actor: {log.actor} ({log.role})</span>
                      {log.proofHash && <span>Hash: {log.proofHash}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
