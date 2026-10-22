import React, { useState } from 'react';
import { 
  X, 
  Workflow, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Users, 
  Layers, 
  ArrowRight, 
  Hash, 
  KeyRound, 
  Database, 
  Server, 
  Compass,
  FileCheck
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface ArchitectureFlowsModalProps {
  lang: Language;
  onClose: () => void;
  onLaunchScenario?: (scenarioId: string) => void;
}

export const ArchitectureFlowsModal: React.FC<ArchitectureFlowsModalProps> = ({
  lang,
  onClose,
  onLaunchScenario
}) => {
  const [activeTab, setActiveTab] = useState<'user-flow' | 'system-flow' | 'tech-infra'>('user-flow');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  CARGOTRUST ARCHITECTURE BLUEPRINT
                </span>
                <span className="text-xs text-slate-400">v2.4 Production Standard</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-1 tracking-tight">
                {lang === 'vi' 
                  ? 'Kiến Trúc Kỹ Thuật, Luồng Người Dùng & Luồng Hệ Thống' 
                  : 'System Architecture, User Flow & Technical Infrastructure'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50/80 flex items-center gap-6 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('user-flow')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'user-flow'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'vi' ? '1. Luồng Người Dùng (User Flow)' : '1. User Flow & Personas'}</span>
          </button>

          <button
            onClick={() => setActiveTab('system-flow')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'system-flow'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{lang === 'vi' ? '2. Luồng Hệ Thống & Đối Chiếu (System Flow)' : '2. System Flow & Reconciliation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tech-infra')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tech-infra'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>{lang === 'vi' ? '3. Hạ Tầng Công Nghệ (Technology Infrastructure)' : '3. Technology Infrastructure'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/30 text-slate-800">
          
          {/* TAB 1: USER FLOW */}
          {activeTab === 'user-flow' && (
            <div className="space-y-6">
              {/* Intro banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>{lang === 'vi' ? 'Mô hình phân quyền đa vai trò (Multi-Persona Zero-Trust Architecture):' : 'Zero-Trust Multi-Persona Governance:'}</strong>{' '}
                {lang === 'vi' 
                  ? 'CargoTrust loại bỏ hoàn toàn cơ chế phê duyệt 1 chiều dễ bị lạm dụng. Hệ thống thiết lập quy chuẩn Maker-Checker kết hợp với AI Gatekeeper và người ký số được ủy quyền theo giao thức Tide Protocol.'
                  : 'CargoTrust enforces strict Segregation of Duties (SoD). No single actor can self-create, self-verify, and self-sign commercial documents.'}
              </div>

              {/* 4 Steps Interactive Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Step 1: Maker */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center">
                    01
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                    {lang === 'vi' ? 'BƯỚC 1: LẬP HỒ SƠ (MAKER)' : 'STEP 1: INGESTION (MAKER)'}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'vi' ? 'Chuyên Viên Mua Hàng (Minh Le)' : 'Procurement Maker'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{lang === 'vi' ? 'Nạp Đơn đặt hàng (PO) và Hợp đồng' : 'Creates PO baseline & contract'}</li>
                    <li>{lang === 'vi' ? 'Tiếp nhận Hóa đơn (INV) & Phiếu đóng gói' : 'Receives supplier Invoice & Packing List'}</li>
                    <li>{lang === 'vi' ? 'Kiểm tra checklist chứng từ bắt buộc' : 'Tracks mandated trade checklist'}</li>
                  </ul>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                    Role: Procurement Specialist
                  </div>
                </div>

                {/* Step 2: AI Gatekeeper */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-extrabold text-xs flex items-center justify-center">
                    02
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                    {lang === 'vi' ? 'BƯỚC 2: RÀ SOÁT TỰ ĐỘNG' : 'STEP 2: AI GATEKEEPER'}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'vi' ? 'Cổng AI Gatekeeper Tự Động' : 'AI Cross-Matching Engine'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{lang === 'vi' ? 'Tự động tính mã băm SHA-256' : 'Computes SHA-256 root fingerprint'}</li>
                    <li>{lang === 'vi' ? 'Trích xuất OCR chi tiết từng dòng hàng' : 'Extracts line items from PO & INV'}</li>
                    <li>{lang === 'vi' ? 'Bắt lỗi sai lệch số lượng & giá cả' : 'Flags variances (e.g. 240 vs 220)'}</li>
                  </ul>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                    System: Policy & Match Engine
                  </div>
                </div>

                {/* Step 3: Checker */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                    03
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                    {lang === 'vi' ? 'BƯỚC 3: KIỂM SOÁT (CHECKER)' : 'STEP 3: CHECKER QUORUM'}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'vi' ? 'Quản Lý & Kế Toán (Sarah / David)' : 'Managers & Finance'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{lang === 'vi' ? 'Rà soát ngoại lệ nếu có sai lệch' : 'Inspects flagged discrepancies'}</li>
                    <li>{lang === 'vi' ? 'Quorum kép cho đơn > $10,000' : 'Dual-control for orders > $10k'}</li>
                    <li>{lang === 'vi' ? 'Chống tự phê duyệt hồ sơ của mình' : 'Strict anti-self-approval rule'}</li>
                  </ul>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                    Roles: Operations & Finance
                  </div>
                </div>

                {/* Step 4: Tide Signer */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    04
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                    {lang === 'vi' ? 'BƯỚC 4: KÝ DUYỆT SỐ' : 'STEP 4: CRYPTO SIGNING'}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'vi' ? 'Ký Niêm Phong Mật Mã Tide' : 'Tide Cryptographic Seal'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{lang === 'vi' ? 'Kiểm tra đủ 4 điều kiện an toàn' : 'Verifies all 4 prerequisite gates'}</li>
                    <li>{lang === 'vi' ? 'Đóng dấu niêm phong vĩnh viễn' : 'Applies immutable digital seal'}</li>
                    <li>{lang === 'vi' ? 'Phát hành lệnh thông quan / trả tiền' : 'Releases cargo & settlement'}</li>
                  </ul>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                    Standard: Tide Protocol Vault
                  </div>
                </div>
              </div>

              {/* 4 Dimensional Status Matrix explanation */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'vi' ? 'Ma Trận Quản Trị Độc Lập 4 Chiều (4-Dimensional Governance Matrix)' : '4 Independent Operational Dimensions'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">1. Đầy đủ (Completeness)</span>
                    <span className="text-slate-600">Kiểm tra số lượng chứng từ bắt buộc (ví dụ 6/6 chứng từ). Thiếu bất kỳ tài liệu nào sẽ khóa cổng ký.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">2. Đối chiếu (Consistency)</span>
                    <span className="text-slate-600">Đối chiếu 3 chiều giữa Hợp đồng ↔ PO ↔ Hóa đơn ↔ Packing List. Không chấp nhận chênh lệch số lượng.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">3. Phê duyệt (Approval Quorum)</span>
                    <span className="text-slate-600">Đo lường tiến độ biểu quyết của các thẩm quyền độc lập. Tự động áp dụng Quorum kép nếu trên $10,000.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">4. Ký số (Signing Integrity)</span>
                    <span className="text-slate-600">Trạng thái khóa mật mã của bộ chứng từ. Bất kỳ sự sửa đổi file nào sau khi ký sẽ phá vỡ chữ ký ngay lập tức.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM FLOW */}
          {activeTab === 'system-flow' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                <strong>{lang === 'vi' ? 'Luồng dữ liệu nhị phân & cơ chế kiểm soát kỹ thuật:' : 'Technical Data Pipeline & Control Gates:'}</strong>{' '}
                {lang === 'vi'
                  ? 'Khi một chứng từ được nạp vào, CargoTrust kích hoạt pipeline đối chiếu khép kín từ trích xuất mã băm, phân tích cú pháp dữ liệu cấu trúc, đến đánh giá chính sách và khóa cổng an toàn.'
                  : 'Automated end-to-end pipeline executing byte ingestion, hashing, line item parsing, policy validation, and cryptographic sealing.'}
              </div>

              {/* Data Flow Diagram Card */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>SYSTEM DATA FLOW DIAGRAM</span>
                  <span>DETERMINISTIC ZERO-LATENCY PIPELINE</span>
                </div>

                <div className="space-y-3 font-mono leading-relaxed text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-blue-400 font-bold">[1] Ingestion & Buffer:</span> File nhị phân (PDF/XML) được nạp vào bộ nhớ.
                    </div>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Buffer Read</span>
                  </div>

                  <div className="text-center text-slate-500 font-bold">↓ SHA-256 Hashing Algorithm</div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold">[2] Cryptographic Fingerprint:</span> Sinh mã băm SHA-256 duy nhất, chống can thiệp (Tamper Detection).
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Root Hash</span>
                  </div>

                  <div className="text-center text-slate-500 font-bold">↓ Semantic Line-Item Parsing</div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">[3] 3-Way Cross-Reconciliation:</span> So khớp chéo số lượng & đơn giá giữa PO ↔ Invoice ↔ GRN/PL.
                    </div>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Variance Engine</span>
                  </div>

                  <div className="text-center text-slate-500 font-bold">↓ Rule Engine Policy Check</div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-purple-400 font-bold">[4] Policy &amp; Governance Gate:</span> Kiểm tra Quorum (&gt; $10k), Chặn tự duyệt (Anti-Self-Approval), Khóa cổng khi sai lệch.
                    </div>
                    <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">Policy Gates</span>
                  </div>

                  <div className="text-center text-slate-500 font-bold">↓ Tide Protocol Signature</div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-cyan-400 font-bold">[5] Cryptographic Sealing & Immutable Audit:</span> Khóa chữ ký số bất biến và ghi nhật ký kiểm toán vĩnh viễn.
                    </div>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">Append-Only Log</span>
                  </div>
                </div>
              </div>

              {/* Exception Handling Mechanism */}
              <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>{lang === 'vi' ? 'Cơ Chế Khóa Tự Động Khi Phát Hiện Sai Lệch (Exception Circuit Breaker)' : 'Automated Discrepancy Circuit Breaker'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'vi'
                    ? 'Nếu phát hiện bất kỳ sự chênh lệch nào (ví dụ PO đặt 220 nhưng Invoice đòi 240 sản phẩm, hoặc Packing List ghi sai quy cách đóng gói), hệ thống lập tức chuyển trạng thái Consistency sang "Cần kiểm tra" và TỰ ĐỘNG KHÓA CỔNG KÝ DUYỆT. Người dùng chỉ có 2 lựa chọn: (1) Yêu cầu đối tác xuất lại hóa đơn đúng, hoặc (2) Trình duyệt ngoại lệ thông qua Quorum kép đặc biệt có giải trình.'
                    : 'Any quantity or price variance immediately locks the cryptographic execution gate. The order cannot be released until either a corrected invoice is ingested or a dual-quorum exception waiver is authorized.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNOLOGY INFRASTRUCTURE */}
          {activeTab === 'tech-infra' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>{lang === 'vi' ? 'Kiến trúc công nghệ hiện đại, hiệu năng cao và phân tán:' : 'Modern High-Performance Distributed Tech Stack:'}</strong>{' '}
                {lang === 'vi'
                  ? 'CargoTrust được xây dựng theo chuẩn Single Page Application tốc độ cao, kết hợp công cụ đánh giá chính sách không độ trễ (Zero Latency) và lớp bảo mật mật mã hóa theo chuẩn công nghiệp thương mại quốc tế.'
                  : 'Engineered with React 19, TypeScript, deterministic Edge policy evaluation, and enterprise-grade cryptographic guarantees.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tech Item 1: Frontend */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <Layers className="w-4 h-4" />
                    <span>Frontend & UI Layer</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>React 19 + TypeScript:</strong> Type-safety tuyệt đối, loại bỏ lỗi runtime.</li>
                    <li><strong>Tailwind CSS:</strong> Giao diện responsive linh hoạt cho Desktop & Mobile.</li>
                    <li><strong>Lucide Icons:</strong> Hệ thống biểu tượng trực quan, chuẩn hóa.</li>
                    <li><strong>Bilingual i18n:</strong> Hỗ trợ Tiếng Việt mặc định và Tiếng Anh tức thì.</li>
                  </ul>
                </div>

                {/* Tech Item 2: Policy Engine */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Deterministic Policy Engine</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Zero-Latency Rule Evaluator:</strong> Đánh giá phân quyền & Quorum trong &lt; 5ms.</li>
                    <li><strong>Anti-Self-Approval Enforcement:</strong> Chặn tuyệt đối người tạo tự duyệt hồ sơ.</li>
                    <li><strong>Dynamic Threshold Gates:</strong> Tự động kích hoạt Quorum kép cho đơn &gt; $10k.</li>
                    <li><strong>Status Rollup Engine:</strong> Tổng hợp logic 4 chiều chính xác, không nhầm lẫn.</li>
                  </ul>
                </div>

                {/* Tech Item 3: Cryptography */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Cryptographic & Integrity Layer</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>SHA-256 Fingerprinting:</strong> Băm toàn bộ hồ sơ thành chuỗi fingerprint bất biến.</li>
                    <li><strong>Tide Protocol Signing Gateway:</strong> Khóa chữ ký số vào mã băm gốc.</li>
                    <li><strong>Instant Tamper Detection:</strong> Phát hiện bit-flip nếu file bị chỉnh sửa 1 ký tự.</li>
                    <li><strong>Cryptographic Proof Verification:</strong> Kiểm tra tính toàn vẹn độc lập mọi lúc.</li>
                  </ul>
                </div>

                {/* Tech Item 4: State & Audit */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Database className="w-4 h-4" />
                    <span>Real-time State & Audit Trail</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Reactive Synchronized Store:</strong> Đồng bộ tức thì Orders ↔ Docs ↔ Approvals.</li>
                    <li><strong>Append-Only Audit Log:</strong> Nhật ký kiểm toán không thể xóa hoặc sửa đổi.</li>
                    <li><strong>Traceable Actor Context:</strong> Ghi rõ Người dùng, Vai trò, Dấu thời gian, Kết quả.</li>
                    <li><strong>Exportable Evidence Bundle:</strong> Sẵn sàng cho thanh tra hải quan & kiểm toán ngân hàng.</li>
                  </ul>
                </div>
              </div>

              {/* Security Standards banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono">
                  <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complies with ISO 27001, UN/CEFACT Trade Standards & NIST Cryptographic Guidelines</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-[11px] shrink-0">
                  SECURE & CERTIFIED
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {lang === 'vi' 
              ? 'Tài liệu kiến trúc hệ thống thương mại quốc tế CargoTrust · Bản cập nhật Q4/2026' 
              : 'CargoTrust Trade Governance Infrastructure Documentation · Q4/2026 Edition'}
          </div>

          <div className="flex items-center gap-2.5">
            {onLaunchScenario && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchScenario('scenario-mismatch');
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold text-xs transition-colors"
              >
                {lang === 'vi' ? '⚡ Thử Ngay Kịch Bản Demo' : '⚡ Test Live Scenarios'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              {lang === 'vi' ? 'Đóng Tài Liệu' : 'Close Blueprint'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
