import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Bot, 
  KeyRound, 
  Sparkles, 
  Play, 
  FileText, 
  Users, 
  Lock, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLaunchDemoScenario: (orderId: string, tab?: string) => void;
}

export const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLaunchDemoScenario
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'steps' | 'matrix' | 'scenario'>('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {lang === 'vi' ? 'Hướng Dẫn Dành Cho Người Mới Sử Dụng' : 'New User Onboarding & Architecture Guide'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {lang === 'vi' ? 'Quy chuẩn 2026' : 'Standard 2026'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'vi' 
                  ? 'Tìm hiểu mô hình quản trị lấy Đơn hàng làm trung tâm & cơ chế phân quyền kiểm soát Maker-Checker' 
                  : 'Understand the Order-Centric workflow and distributed Maker-Checker authorization matrix'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'flow'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{lang === 'vi' ? '1. Mô Hình Lấy Đơn Hàng Làm Gốc' : '1. Order-Centric Architecture'}</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'vi' ? '2. Quy Trình 5 Bước Kiểm Soát' : '2. 5-Step Control Flow'}</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'vi' ? '3. Ma Trận 4 Trạng Thái & Maker-Checker' : '3. 4-Dimension Matrix & Roles'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scenario')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'scenario'
                ? 'border-amber-600 text-amber-800 bg-amber-50/70 rounded-t-lg font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>{lang === 'vi' ? '4. Kịch Bản Mẫu Demo (RMIT)' : '4. Demo Scenario (Live)'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: ORDER-CENTRIC ARCHITECTURE */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950 mb-1">
                      {lang === 'vi' 
                        ? 'Tại sao lại là Mô Hình Quản Trị Lấy Đơn Hàng Làm Trung Tâm?' 
                        : 'Why Order-Centric Architecture?'}
                    </h3>
                    <p className="text-xs text-blue-900/90 leading-relaxed">
                      {lang === 'vi' 
                        ? 'Trong thương mại quốc tế và logistics, tài liệu không tồn tại rời rạc. Một Đơn hàng (Order) là gốc rễ pháp lý ràng buộc các bên, sinh ra các Đợt giao hàng (Shipments), và gắn kết toàn bộ Bộ chứng từ (Hợp đồng, PO, Hóa đơn thương mại, Vận đơn B/L, Phiếu đóng gói Packing List, Phiếu nhập kho GRN).' 
                        : 'In international trade and logistics, documents do not exist in silos. An Order serves as the root legal and commercial anchor that spans Shipments and binds the complete Document Pack (Contract, PO, Invoice, B/L, Packing List, GRN).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hierarchy Visual Diagram */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {lang === 'vi' ? 'Cấu Trúc Cây Dữ Liệu 3 Tầng' : '3-Tier Data Architecture'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tier 1: Order */}
                  <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/40 relative">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-block mb-2">
                      Tầng 1 · Root Entity
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {lang === 'vi' ? 'Đơn Hàng (Order)' : 'Commercial Order'}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {lang === 'vi' 
                        ? 'Giao kết thương mại: Người mua, Người bán, Điều kiện Incoterms, Loại hàng, Giá trị thanh toán, Kỳ hạn L/C.'
                        : 'Commercial binding: Buyer, Seller, Incoterms, Commodity, Value, Payment terms.'}
                    </p>
                    <div className="text-[10px] font-mono bg-white p-2 rounded border border-blue-200 text-blue-900 font-semibold">
                      VD: ORD-2026-001 ($18,420 USD)
                    </div>
                  </div>

                  {/* Tier 2: Shipment */}
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 relative">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full inline-block mb-2">
                      Tầng 2 · Logistics Event
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {lang === 'vi' ? 'Đợt Giao Hàng (Shipment)' : 'Logistics Shipment'}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {lang === 'vi' 
                        ? '1 Đơn hàng có thể giao 1 lần hoặc tách nhiều đợt. Quản lý tàu vận tải, số container, cảng bốc, cảng dỡ.'
                        : 'An order may span multiple shipments. Tracks vessels, flights, containers, origin/dest ports.'}
                    </p>
                    <div className="text-[10px] font-mono bg-white p-2 rounded border border-indigo-200 text-indigo-900 font-semibold">
                      VD: SHP-8841-A (Tàu Busan Glory)
                    </div>
                  </div>

                  {/* Tier 3: Documents Checklist */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 relative">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-2">
                      Tầng 3 · Compliance Evidence
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {lang === 'vi' ? 'Bộ Chứng Từ (Document Pack)' : 'Document Pack Checklist'}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {lang === 'vi' 
                        ? 'Checklist đầy đủ theo loại hàng: Contract, PO, Hóa đơn, Vận đơn, Packing List, C/O, Phiếu nhập kho GRN.'
                        : 'Checklist mandated by commodity: Contract, PO, Invoice, B/L, Packing List, C/O, GRN.'}
                    </p>
                    <div className="text-[10px] font-mono bg-white p-2 rounded border border-emerald-200 text-emerald-900 font-semibold">
                      Đầy đủ 5/6 · Băm SHA-256
                    </div>
                  </div>
                </div>
              </div>

              {/* What happens to loose documents */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">
                    {lang === 'vi' ? 'Sổ bộ chứng từ (Documents View) vẫn được giữ nguyên: ' : 'Global Document View is retained: '}
                  </span>
                  {lang === 'vi' 
                    ? 'Bạn vẫn có thể tìm kiếm, tra cứu toàn bộ tài liệu theo nhà cung cấp, loại file, hoặc xem chi tiết chứng từ ở mục "Sổ bộ chứng từ", nhưng không gian xử lý theo Đơn hàng (Orders) là nơi ra quyết định kinh doanh.'
                    : 'You can still search and audit across all documents globally in the "Documents" tab, but the Order Workspace is where cross-matching and authorizations occur.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 5-STEP CONTROL FLOW */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {lang === 'vi'
                  ? 'Quy trình kiểm soát tài liệu ngoại thương và logistics được thiết kế tự động hóa cao nhưng tuân thủ nghiêm ngặt chuẩn quản trị:'
                  : 'The international trade document governance workflow follows 5 structured and cryptographically protected gates:'}
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    titleVi: 'Khởi tạo Đơn Hàng & Kích hoạt Checklist',
                    titleEn: 'Order Ingestion & Checklist Activation',
                    descVi: 'Tạo đơn hàng từ hợp đồng ngoại thương. Hệ thống tự động xác định bộ chứng từ bắt buộc cần có cho loại hàng hóa cụ thể (hàng điện tử, nông sản, hóa chất).',
                    descEn: 'Initialize order from sales contract. System automatically activates mandated checklist based on commodity type.',
                    badge: 'Ops / Maker',
                    color: 'blue'
                  },
                  {
                    step: 2,
                    titleVi: 'Nạp Chứng Từ & Tạo Vân Tay Băm Mật Mã (Fingerprinting)',
                    titleEn: 'Document Ingestion & Fingerprinting',
                    descVi: 'Mỗi chứng từ nạp vào được trích xuất dữ liệu dòng hàng (Line Items) và sinh mã băm SHA-256 bất biến. Bất kỳ sự chỉnh sửa lén nào sau đó đều bị phát hiện.',
                    descEn: 'Each ingested document generates a SHA-256 cryptographic hash. Any subsequent tampering or unauthorized edits are detected immediately.',
                    badge: 'Security Gate',
                    color: 'indigo'
                  },
                  {
                    step: 3,
                    titleVi: 'AI Đối Chiếu Chéo 3 Chiều & 4 Chiều (AI Cross-Matching)',
                    titleEn: 'AI Multi-Way Cross-Document Reconciliation',
                    descVi: 'AI quét chéo số lượng, đơn giá, mã hàng giữa PO ↔ Contract ↔ Commercial Invoice ↔ Packing List. Nếu lệch 1 chiếc hay 1 xu, hệ thống cảnh báo ngay lập tức.',
                    descEn: 'AI scans quantities, unit prices, and SKU codes across PO ↔ Contract ↔ Invoice ↔ Packing List. Discrepancies trigger instant alerts.',
                    badge: 'AI Guardrail',
                    color: 'amber'
                  },
                  {
                    step: 4,
                    titleVi: 'Thẩm Quyền & Phê Duyệt Phân Quyền (Maker-Checker)',
                    titleEn: 'Maker-Checker Approval & Governance Quorum',
                    descVi: 'Người nạp chứng từ (Maker) không thể tự duyệt (Checker). Với đơn hàng lớn > $10,000 hoặc có sai lệch, bắt buộc phải có ít nhất 2 chữ ký phê duyệt từ Quản lý Vận hành & Giám đốc Tài chính.',
                    descEn: 'Maker cannot self-approve. High-value orders > $10k or discrepancy cases require dual-sign-off by Operations Manager & Finance Director.',
                    badge: 'Separation of Duties',
                    color: 'emerald'
                  },
                  {
                    step: 5,
                    titleVi: 'Ký Duyệt Bảo Vệ Mật Mã (Tide Protected Signing) & Nhật Ký Kiểm Toán',
                    titleEn: 'Tide Protected Cryptographic Signing & Audit Trail',
                    descVi: 'Khi đủ điều kiện, chứng từ được ký số bằng khóa quản trị an toàn. Mọi hành động, người duyệt, băm giao dịch được ghi vĩnh viễn vào nhật ký kiểm toán không thể xóa.',
                    descEn: 'Authorized documents are digitally signed under protected key governance. Full audit trail is written with non-repudiation proofs.',
                    badge: 'Tide Protocol',
                    color: 'purple'
                  }
                ].map((item) => (
                  <div key={item.step} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {lang === 'vi' ? item.titleVi : item.titleEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lang === 'vi' ? item.descVi : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 4 STATUS DIMENSIONS & MAKER-CHECKER */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'vi' 
                    ? 'Ma Trận Trạng Thái 4 Chiều Độc Lập' 
                    : '4 Independent Status Dimensions'}
                </h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {lang === 'vi'
                    ? 'CargoTrust không gộp chung trạng thái vào một nhãn duy nhất mà tách thành 4 chiều độc lập để người dùng nắm rõ điểm tắc nghẽn của từng hồ sơ:'
                    : 'Instead of compressing status into a single generic label, CargoTrust isolates 4 orthogonal status vectors:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
                    <div className="font-bold text-blue-950 text-xs flex items-center gap-2 mb-1">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>{lang === 'vi' ? '1. Tính Đầy Đủ (Completeness)' : '1. Completeness'}</span>
                    </div>
                    <p className="text-[11px] text-blue-900 leading-relaxed">
                      {lang === 'vi' 
                        ? 'Đo lường tiến độ nạp bộ chứng từ so với checklist bắt buộc (ví dụ 5/6 chứng từ). Các trạng thái: Chưa bắt đầu, Chưa đầy đủ, Đầy đủ.' 
                        : 'Tracks document uploads against checklist. States: Not Started, Incomplete, Complete, N/A.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                    <div className="font-bold text-amber-950 text-xs flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'vi' ? '2. Tính Nhất Quán (Consistency)' : '2. Consistency & Matching'}</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      {lang === 'vi' 
                        ? 'Đo lường kết quả AI đối chiếu chéo số lượng, đơn giá, mô tả hàng. Các trạng thái: Chưa kiểm tra, Khớp dữ liệu, Cần kiểm tra, Đã xử lý sai lệch.' 
                        : 'Tracks AI cross-document reconciliation. States: Not Checked, Matched, Needs Review, Discrepancy Resolved.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40">
                    <div className="font-bold text-indigo-950 text-xs flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{lang === 'vi' ? '3. Phê Duyệt Nội Bộ (Approval)' : '3. Governance Approval'}</span>
                    </div>
                    <p className="text-[11px] text-indigo-900 leading-relaxed">
                      {lang === 'vi' 
                        ? 'Trạng thái quy trình Maker-Checker: Chưa gửi, Chờ phê duyệt, Đang rà soát, Yêu cầu chỉnh sửa, Đã phê duyệt, Bị từ chối.' 
                        : 'Tracks multi-level human approvals. States: Draft, Pending Approval, Under Review, Changes Requested, Approved, Rejected.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                    <div className="font-bold text-purple-950 text-xs flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <span>{lang === 'vi' ? '4. Trạng Thái Ký Số (Signing)' : '4. Cryptographic Signing'}</span>
                    </div>
                    <p className="text-[11px] text-purple-900 leading-relaxed">
                      {lang === 'vi' 
                        ? 'Trạng thái chữ ký bảo vệ: Không yêu cầu ký, Chờ ký, Đang chờ xác thực, Đã ký, Ký thất bại, Cần ký lại (khi bị sửa đổi file).' 
                        : 'Tracks cryptographic execution. States: Not Required, Pending Sign, Processing, Signed, Failed, Resign Required.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles & Separation of Duties Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {lang === 'vi' ? 'Nguyên Tắc Phân Quyền Bất Biến (Security Guardrails)' : 'Immutable Governance Guardrails'}
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-900">AI Agent:</strong> {lang === 'vi' ? 'Chỉ đề xuất và phân tích rủi ro, TUYỆT ĐỐI không có quyền tự động phê duyệt hoặc ký văn bản thay thế con người.' : 'Can propose and flag anomalies, but CANNOT self-approve or digitally sign.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-900">Maker-Checker (Tách bạch vai trò):</strong> {lang === 'vi' ? 'Chuyên viên mua hàng (Alex Turner - Procurement Specialist) là người nạp chứng từ nên hệ thống sẽ chặn không cho Alex tự phê duyệt.' : 'Alex Turner (Procurement Specialist) who ingested the document cannot approve it.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong className="text-slate-900">{lang === 'vi' ? 'Kiểm soát tính toàn vẹn (Integrity):' : 'Cryptographic Integrity:'}</strong> {lang === 'vi' ? 'Nếu một tài liệu bị thay thế nội dung sau khi đã phê duyệt, hệ thống sẽ tự động thu hồi phê duyệt và yêu cầu ký lại.' : 'Any file hash change post-approval instantly revokes approval and triggers resign requirement.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: RMIT DEMO SCENARIO */}
          {activeTab === 'scenario' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-950">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <span>{lang === 'vi' ? 'Kịch Bản Demo Nổi Bật: Phát Hiện Sai Lệch Lô Hàng ORD-2026-001' : 'Featured Demo Scenario: Discrepancy in ORD-2026-001'}</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {lang === 'vi'
                    ? 'Đây là kịch bản chuẩn trong cuộc thi RMIT Hackathon để ban giám khảo và người dùng mới kiểm thử khả năng đối chiếu chéo thông minh của AI và cơ chế kiểm soát phê duyệt ngoại lệ.'
                    : 'This is the signature demo scenario for evaluating AI cross-document reconciliation and exception governance.'}
                </p>
              </div>

              {/* Scenario details table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    {lang === 'vi' ? 'Hồ sơ: Nhập khẩu Vi điều khiển ARM Cortex-M4' : 'Order: ARM Cortex-M4 Microcontroller Import'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    ORD-2026-001
                  </span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Người mua (Buyer)' : 'Buyer'}</span>
                      <span className="font-bold text-slate-800">Atlas Components Vietnam JSC</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{lang === 'vi' ? 'Người bán (Seller)' : 'Seller'}</span>
                      <span className="font-bold text-slate-800">Seoul Electronics Ltd. (Hàn Quốc)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                    <div className="font-bold text-xs text-rose-900 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      {lang === 'vi' ? 'Sai Lệch Đã Bị AI Bắt Lỗi:' : 'Flagged Discrepancy:'}
                    </div>
                    <ul className="space-y-1 text-xs text-rose-900 list-disc list-inside">
                      <li>
                        <strong>Đơn đặt hàng (PO-1182) & Hợp đồng (SC-2026-KR):</strong> 220 chiếc @ $83.73 = <span className="font-mono font-bold">$18,420.00 USD</span>
                      </li>
                      <li>
                        <strong>Hóa đơn thương mại (INV-2408) & Phiếu đóng gói (PL-2408):</strong> Nhà cung cấp xuất 240 chiếc = <span className="font-mono font-bold text-rose-700">$20,094.00 USD (+20 chiếc / +$1,674 USD)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    {lang === 'vi'
                      ? '👉 Khi bạn bấm nút bên dưới, hệ thống sẽ mở trực tiếp Không Gian Làm Việc của đơn hàng ORD-2026-001 vào tab "AI Đối Chiếu Chéo" để bạn trải nghiệm cách giải trình hoặc gửi phê duyệt ngoại lệ.'
                      : '👉 Clicking the button below opens the ORD-2026-001 Workspace directly on the "AI Cross-Document Review" tab to test exception approvals.'}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-xs"
                >
                  {lang === 'vi' ? 'Đóng hướng dẫn' : 'Close Guide'}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onLaunchDemoScenario('ord-101', 'ai-review');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{lang === 'vi' ? 'Bắt Đầu Trải Nghiệm Kịch Bản Này Ngay' : 'Launch Demo Scenario Workspace'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with quick tip */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {lang === 'vi' 
                ? 'Mẹo: Bạn có thể đổi vai trò (Sarah/Alex/Marcus) ở góc trên bên phải để kiểm tra quyền hạn.' 
                : 'Tip: Switch roles (Sarah/Alex/Marcus) in the top-right to test permission policies.'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            {lang === 'vi' ? 'Đã hiểu' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
