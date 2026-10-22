import React from 'react';
import { 
  X, 
  Target, 
  AlertTriangle, 
  FileQuestion, 
  ShieldAlert, 
  Scale, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language } from '../i18n/translations';
import { DocumentRecord, OrderRecord, UserSession } from '../types';

interface DemoScenariosModalProps {
  lang: Language;
  currentUser: UserSession;
  documents: DocumentRecord[];
  orders: OrderRecord[];
  onClose: () => void;
  onSelectOrder: (orderId: string, initialTab?: string) => void;
  onOpenDoc: (docId: string) => void;
  onSwitchUser: (userId: string) => void;
  onSimulateTamper: (docId: string, isTampered: boolean) => void;
  onSimulateUploadMissingDocs: (orderId: string) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  lang,
  currentUser,
  documents,
  orders,
  onClose,
  onSelectOrder,
  onOpenDoc,
  onSwitchUser,
  onSimulateTamper,
  onSimulateUploadMissingDocs,
  onShowToast
}) => {
  const invoice2408 = documents.find(d => d.id === 'DOC-2408');
  const isInvoiceTampered = invoice2408?.isTampered ?? false;

  const order4 = orders.find(o => o.id === 'ord-104');
  const isOrder4Complete = order4?.completeness === 'Đầy đủ';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  TEST & DEMO SUITE
                </span>
                <span className="text-xs text-slate-400">Interactive Validation Center</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-1 tracking-tight">
                {lang === 'vi' 
                  ? 'Trung Tâm Kịch Bản Kiểm Thử Demo Trực Quan' 
                  : 'Interactive Live Test Scenarios Center'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="px-6 py-3.5 bg-indigo-50/80 border-b border-indigo-100 text-xs text-indigo-950 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              {lang === 'vi'
                ? 'Chọn 1 kịch bản dưới đây để hệ thống tự động thiết lập trạng thái thực tế và dẫn dắt bạn qua quy trình xử lý:'
                : 'Select any scenario below to automatically load live data states and test interactive operational flows:'}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
            4 / 4 Scenarios Ready
          </span>
        </div>

        {/* Scenarios Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
          
          {/* SCENARIO 1: Chênh lệch số lượng đơn hàng (Quantity Mismatch) */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs hover:border-rose-400 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                  01
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      {lang === 'vi' ? 'Sai Lệch Dữ Liệu' : 'Quantity Mismatch'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">ORD-2026-001</span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 mt-1">
                    {lang === 'vi' 
                      ? 'Kịch bản 1: Phát Hiện Chênh Lệch Số Lượng (PO 220 pcs vs Invoice 240 pcs)' 
                      : 'Scenario 1: Quantity Mismatch (PO 220 pcs vs Invoice 240 pcs)'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onSelectOrder('ord-101', 'ai-review');
                  onShowToast(
                    lang === 'vi' ? 'Đã tải Kịch bản 1: Chênh lệch số lượng' : 'Scenario 1 Loaded',
                    lang === 'vi' ? 'Đang mở ORD-2026-001 tại tab AI Đối Chiếu. Hãy quan sát bảng so sánh dòng hàng và cổng ký bị khóa.' : 'Opening ORD-2026-001 AI Review tab.',
                    'info'
                  );
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Chạy Kịch Bản Này' : 'Launch Scenario'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? 'Hợp đồng & PO-1182 chỉ đặt 220 vi điều khiển ARM Cortex-M4. Tuy nhiên, nhà cung cấp Seoul Electronics xuất Hóa đơn INV-2408 đòi thanh toán 240 chiếc (+20 chiếc, vênh +$1,535.00). Cổng AI tự động bắt lỗi sai lệch, chuyển trạng thái Đối chiếu sang "Cần kiểm tra" và khóa cổng Ký duyệt Tide.'
                : 'PO-1182 authorized 220 units. Commercial Invoice INV-2408 billed 240 units (+$1,535.00 variance). AI gatekeeper flags the variance and locks cryptographic execution.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">PO-1182 Baseline</span>
                <span className="font-mono font-bold text-slate-800">220 pcs · $16,885.00</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-rose-500 block text-[10px] uppercase font-bold">INV-2408 Billed</span>
                <span className="font-mono font-bold text-rose-700">240 pcs · $18,420.00 (+20)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cổng Phân Quyền</span>
                <span className="font-bold text-rose-600">Khóa cổng ký số tuyệt đối</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">{lang === 'vi' ? 'Hành động nhanh:' : 'Quick Actions:'}</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenDoc('DOC-2407');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {lang === 'vi' ? '📄 Xem file PO-1182' : 'View PO-1182'}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenDoc('DOC-2408');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {lang === 'vi' ? '📄 Xem file INV-2408' : 'View INV-2408'}
              </button>
              <button
                onClick={() => {
                  onSwitchUser('usr-sarah');
                  onClose();
                  onSelectOrder('ord-101', 'approvals');
                  onShowToast(
                    lang === 'vi' ? 'Đã đổi sang Sarah Chen' : 'Switched to Sarah Chen',
                    lang === 'vi' ? 'Vai trò Quản lý Vận hành (Operations Manager) có quyền xem xét phê duyệt ngoại lệ.' : 'Operations Manager role loaded.',
                    'info'
                  );
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                {lang === 'vi' ? '👤 Đổi sang Sarah Chen để duyệt ngoại lệ' : 'Switch to Sarah Chen to resolve'}
              </button>
            </div>
          </div>

          {/* SCENARIO 2: Thiếu chứng từ bắt buộc (Missing Mandated Documents) */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs hover:border-amber-400 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                  02
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      {lang === 'vi' ? 'Tính Đầy Đủ' : 'Missing Documents'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">ORD-2026-004</span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 mt-1">
                    {lang === 'vi' 
                      ? 'Kịch bản 2: Phát Hiện Thiếu Chứng Từ Bắt Buộc (Chỉ có 3/6 tài liệu)' 
                      : 'Scenario 2: Mandated Document Deficiency (Only 3/6 Uploaded)'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onSelectOrder('ord-104', 'checklist');
                    onShowToast(
                      lang === 'vi' ? 'Đã tải Kịch bản 2: Thiếu chứng từ' : 'Scenario 2 Loaded',
                      lang === 'vi' ? 'Đang mở ORD-2026-004 tại tab Checklist chứng từ.' : 'Opening ORD-2026-004 Checklist tab.',
                      'info'
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Xem Đơn Thiếu' : 'Inspect Order'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? 'Đơn hàng nhập khẩu tấm bán dẫn $31,500 mới chỉ có Sales Contract và PO. Còn thiếu Phiếu đóng gói (Packing List), Vận đơn đường biển (B/L) và Chứng nhận xuất xứ (C/O). Trạng thái Completeness báo "Chưa đầy đủ" và khóa tiến trình thanh toán quốc tế.'
                : 'Semiconductor import order worth $31,500 only has Contract & PO uploaded. Mandated Packing List, B/L, and C/O are missing. Completeness gate holds the workflow.'}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-amber-900 block">
                  {lang === 'vi' ? 'Trạng thái hiện tại: ' : 'Current State: '}
                  {isOrder4Complete 
                    ? (lang === 'vi' ? '✅ ĐÃ BỔ SUNG ĐỦ 6/6 CHỨNG TỪ' : '✅ 6/6 DOCUMENTS COMPLETED')
                    : (lang === 'vi' ? '⚠️ 3/6 CHỨNG TỪ (Thiếu PL, B/L, C/O)' : '⚠️ 3/6 DOCUMENTS (Missing PL, B/L, C/O)')}
                </span>
                <span className="text-amber-800 text-[11px]">
                  {isOrder4Complete 
                    ? (lang === 'vi' ? 'Hồ sơ đã hợp lệ để chuyển sang đối chiếu AI và phê duyệt.' : 'Order bundle complete and ready for AI reconciliation.')
                    : (lang === 'vi' ? 'Nhấn nút bên phải để mô phỏng tải lên tức thì các chứng từ còn thiếu.' : 'Click button to simulate uploading missing documents.')}
                </span>
              </div>

              {!isOrder4Complete ? (
                <button
                  onClick={() => {
                    onSimulateUploadMissingDocs('ord-104');
                    onShowToast(
                      lang === 'vi' ? 'Đã bổ sung chứng từ thành công' : 'Documents Ingested',
                      lang === 'vi' ? 'Đã nạp tự động Packing List, B/L và C/O cho ORD-2026-004. Đơn hàng đạt 6/6 Đầy đủ!' : 'Attached missing PL, B/L, and C/O to ORD-2026-004.',
                      'success'
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  {lang === 'vi' ? '⚡ Mô Phỏng Nạp Đủ Chứng Từ' : '⚡ Simulate Full Ingestion'}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                  {lang === 'vi' ? '✓ Đã hoàn tất đủ 6/6' : '✓ 6/6 Ingested'}
                </span>
              )}
            </div>
          </div>

          {/* SCENARIO 3: Can thiệp mật mã (Cryptographic Tampering / Breach) */}
          <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-xs hover:border-purple-400 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                  03
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                      {lang === 'vi' ? 'An Ninh Mật Mã' : 'Cryptographic Integrity'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">DOC-2408</span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 mt-1">
                    {lang === 'vi' 
                      ? 'Kịch bản 3: Phát Hiện Chứng Từ Bị Can Thiệp Mật Mã (Tampered File / Hash Mismatch)' 
                      : 'Scenario 3: Cryptographic Tampering Breach (Hash Mismatch)'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isInvoiceTampered ? (
                  <button
                    onClick={() => {
                      onSimulateTamper('DOC-2408', true);
                      onOpenDoc('DOC-2408');
                      onShowToast(
                        lang === 'vi' ? 'Cảnh báo an ninh: Phát hiện can thiệp!' : 'Security Alert: Tampering Detected!',
                        lang === 'vi' ? 'Mã băm SHA-256 của DOC-2408 bị thay đổi! Hệ thống đã tự động thu hồi chữ ký và báo động đỏ.' : 'DOC-2408 hash mismatch detected. Signatures revoked.',
                        'error'
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Mô Phỏng Tấn Công Sửa File' : 'Simulate File Tampering'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSimulateTamper('DOC-2408', false);
                      onShowToast(
                        lang === 'vi' ? 'Đã khôi phục tính toàn vẹn' : 'Integrity Restored',
                        lang === 'vi' ? 'DOC-2408 đã được khôi phục về mã băm gốc an toàn.' : 'DOC-2408 original cryptographic fingerprint restored.',
                        'success'
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Khôi Phục Tính Toàn Vẹn' : 'Restore File Integrity'}</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? 'Thử nghiệm cơ chế bảo vệ của Tide Protocol: Khi 1 byte trong file PDF bị chỉnh sửa hoặc tráo đổi ngoài luồng, mã SHA-256 bị thay đổi. CargoTrust lập tức gióng chuông cảnh báo vi phạm an ninh, thu hồi quyền ký số và khóa toàn bộ dòng luân chuyển hàng hóa.'
                : 'Tests Tide Protocol cryptographic verification. If a single byte is modified externally, SHA-256 root hash fails. The system revokes signatures and triggers emergency security locks.'}
            </p>

            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              isInvoiceTampered 
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <span>Trạng thái tệp DOC-2408: </span>
                <span className={isInvoiceTampered ? 'text-rose-700 underline font-black' : 'text-emerald-700 font-bold'}>
                  {isInvoiceTampered 
                    ? (lang === 'vi' ? '🚨 ĐÃ BỊ SỬA ĐỔI / PHÁ VỠ CHỮ KÝ' : '🚨 TAMPERED / SIGNATURE BROKEN')
                    : (lang === 'vi' ? '🔒 AN TOÀN, NGUYÊN BẢN (SHA-256 VALID)' : '🔒 SECURE & VERIFIED')}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenDoc('DOC-2408');
                }}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                {lang === 'vi' ? 'Xem trong Drawer Mật Mã' : 'Inspect Drawer'} →
              </button>
            </div>
          </div>

          {/* SCENARIO 4: Quorum kép giá trị lớn & Maker-Checker */}
          <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-xs hover:border-blue-400 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  04
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {lang === 'vi' ? 'Maker-Checker & Quorum' : 'Dual Control Quorum'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">ORD-2026-002 ($42,000)</span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 mt-1">
                    {lang === 'vi' 
                      ? 'Kịch bản 4: Phê Duyệt Giá Trị Lớn (> $10k) & Chặn Người Tạo Tự Duyệt' 
                      : 'Scenario 4: High-Value Dual Quorum (> $10k) & Segregation of Duties'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onSelectOrder('ord-102', 'approvals');
                  onShowToast(
                    lang === 'vi' ? 'Đã tải Kịch bản 4: Quorum kép' : 'Scenario 4 Loaded',
                    lang === 'vi' ? 'Đang mở ORD-2026-002 tại tab Phê duyệt Quorum.' : 'Opening ORD-2026-002 Approvals tab.',
                    'info'
                  );
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Chạy Kịch Bản Này' : 'Launch Scenario'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? 'Đơn hàng xuất khẩu có giá trị $42,000 (vượt ngưỡng $10,000 của Chính sách phân quyền số 1). Hệ thống bắt buộc phải có đủ 2 chữ ký độc lập từ 2 phòng ban khác nhau (Operations Manager + Finance Approver). Người tạo hồ sơ (Minh Le) tuyệt đối không được tự phê duyệt.'
                : 'Commercial contract worth $42,000 (> $10k threshold) strictly enforces 2 independent sign-offs from Operations and Finance. Maker (Minh Le) is prohibited from approving their own document.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
              <span className="text-slate-600">
                {lang === 'vi' ? 'Thử đổi vai trò để kiểm tra phân quyền:' : 'Test Segregation of Duties:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    onSwitchUser('usr-minh');
                    onShowToast('Minh Le (Maker)', lang === 'vi' ? 'Là người tạo đơn hàng. Thử phê duyệt sẽ bị chính sách chặn.' : 'Maker role loaded.', 'info');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentUser.id === 'usr-minh' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Minh Le (Maker)
                </button>
                <button
                  onClick={() => {
                    onSwitchUser('usr-sarah');
                    onShowToast('Sarah Chen (Ops Manager)', lang === 'vi' ? 'Có quyền duyệt chữ ký thứ nhất.' : 'Approver 1 role loaded.', 'info');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentUser.id === 'usr-sarah' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Sarah Chen (Duyệt 1/2)
                </button>
                <button
                  onClick={() => {
                    onSwitchUser('usr-david');
                    onShowToast('David Nguyen (Finance Approver)', lang === 'vi' ? 'Có quyền duyệt chữ ký thứ hai hoàn thành Quorum.' : 'Approver 2 role loaded.', 'info');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentUser.id === 'usr-david' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  David Nguyen (Duyệt 2/2)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {lang === 'vi' ? 'Nhấn bất kỳ kịch bản nào để trải nghiệm luồng thao tác hoàn chỉnh.' : 'Click any scenario to experience the full operational workflow.'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {lang === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
