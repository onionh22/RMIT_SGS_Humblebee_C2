import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Hash, 
  Lock, 
  History, 
  RefreshCw,
  Scale
} from 'lucide-react';
import { DocumentRecord, UserSession, PolicyRule, MatchingResult } from '../types';
import { formatCurrency, performThreeWayMatch, evaluateApprovalPolicy } from '../utils/policyEngine';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DocumentInspectorDrawerProps {
  document: DocumentRecord | null;
  allDocuments: DocumentRecord[];
  currentUser: UserSession;
  policies: PolicyRule[];
  lang: Language;
  onClose: () => void;
  onUpdateDocument: (doc: DocumentRecord) => void;
  onAddAuditLog: (event: string, detail: string, result: 'Success' | 'Exception flagged' | 'Blocked by policy' | 'Signed', tone: 'green' | 'red' | 'amber') => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const DocumentInspectorDrawer: React.FC<DocumentInspectorDrawerProps> = ({
  document,
  allDocuments,
  currentUser,
  policies,
  lang,
  onClose,
  onUpdateDocument,
  onAddAuditLog,
  onShowToast
}) => {
  if (!document) return null;
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState<'reconciliation' | 'preview' | 'integrity' | 'timeline'>('reconciliation');
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  // Find linked PO & GRN if applicable
  const linkedPo = allDocuments.find(d => d.referenceNumber === document.linkedPoRef || d.id === document.linkedPoRef);
  const linkedGrn = allDocuments.find(d => d.referenceNumber === document.linkedGrnRef || d.id === document.linkedGrnRef);

  // Compute 3-way match
  const matchingResult: MatchingResult = performThreeWayMatch(linkedPo, document, linkedGrn);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Signed': return t.statuses.signed;
      case 'Approved': return t.statuses.approved;
      case 'Needs Review': return t.statuses.needsReview;
      case 'Pending Approval': return t.statuses.pendingApproval;
      case 'Validation Passed': return t.statuses.validationPassed;
      case 'AI Processed': return t.statuses.aiProcessed;
      default: return status;
    }
  };

  // Re-run AI match simulation
  const handleRerunMatch = () => {
    setIsSimulatingAI(true);
    setTimeout(() => {
      setIsSimulatingAI(false);
      onShowToast(
        matchingResult.isFullyMatched 
          ? (lang === 'vi' ? 'Đối chiếu thành công' : 'Re-analysis Clean') 
          : (lang === 'vi' ? 'Xác nhận ngoại lệ chênh lệch' : 'Exception Confirmed'),
        matchingResult.summaryMessage,
        matchingResult.isFullyMatched ? 'success' : 'error'
      );
      onAddAuditLog(
        'AI 3-Way Match Executed',
        `Evaluated ${document.name} against ${linkedPo?.name || 'none'}. Discrepancies: ${matchingResult.discrepancyCount}`,
        matchingResult.isFullyMatched ? 'Success' : 'Exception flagged',
        matchingResult.isFullyMatched ? 'green' : 'red'
      );
    }, 800);
  };

  // Toggle Tamper Simulation
  const handleToggleTamper = () => {
    const nextTampered = !document.isTampered;
    const updated: DocumentRecord = {
      ...document,
      isTampered: nextTampered,
      fileHash: nextTampered ? 'sha256: 9e01fca31028ba89de048123 (ALTERED)' : 'sha256: 6f8a3d9021e8b2d1c7a45691024e',
      version: nextTampered ? `${document.version}-unauthorized-edit` : '1.0',
      status: nextTampered ? 'Needs Review' : (matchingResult.isFullyMatched ? 'Validation Passed' : 'Needs Review')
    };

    onUpdateDocument(updated);

    if (nextTampered) {
      onShowToast(
        lang === 'vi' ? 'Phát hiện vi phạm tính toàn vẹn' : 'Integrity Breach Detected',
        lang === 'vi' 
          ? 'Dữ liệu tệp đã bị can thiệp trái phép. Dấu vân tay mật mã bị hủy bỏ. Mọi phê duyệt trước đó bị thu hồi.'
          : 'Unauthorized payload modification detected. Cryptographic hash invalidated. Prior approvals revoked.',
        'error'
      );
      onAddAuditLog(
        'Integrity Violation Detected',
        `${document.id} payload altered. Hash mismatch: calculated sha256: 9e01fca3 != baseline signature.`,
        'Blocked by policy',
        'red'
      );
    } else {
      onShowToast(
        lang === 'vi' ? 'Đã khôi phục chứng từ' : 'Document Restored',
        lang === 'vi' ? 'Dữ liệu chứng từ đã được khôi phục về mã băm gốc.' : 'Document payload restored to original baseline hash.',
        'success'
      );
      onAddAuditLog(
        'Document Restored',
        `${document.id} returned to verified baseline state.`,
        'Success',
        'green'
      );
    }
  };

  // Handle Protected Signing execution
  const handleRequestSigning = () => {
    const policyEval = evaluateApprovalPolicy(policies, currentUser, document);

    if (!policyEval.allowed) {
      onShowToast(
        lang === 'vi' ? 'Ký duyệt bị chặn bởi chính sách' : 'Protected Signing Denied by Policy',
        policyEval.reasons[0] || (lang === 'vi' ? 'Hành động không được phân quyền' : 'Unauthorized action'),
        'error'
      );
      onAddAuditLog(
        'Signing Execution Blocked',
        `User ${currentUser.name} (${currentUser.role}) attempted to sign ${document.id}. Reason: ${policyEval.reasons.join('; ')}`,
        'Blocked by policy',
        'red'
      );
      return;
    }

    if (document.status === 'Needs Review' && matchingResult.discrepancyCount > 0) {
      onShowToast(
        lang === 'vi' ? 'Cổng ký duyệt bị khóa' : 'Signing Gate Locked',
        lang === 'vi' 
          ? 'Chứng từ tồn tại chênh lệch 3 chiều chưa được xử lý. Người có thẩm quyền phải duyệt ngoại lệ trước.'
          : 'Unresolved 3-way matching discrepancies exist. An authorized Operations Manager must resolve the variance first.',
        'error'
      );
      return;
    }

    // Execute signing
    const updated: DocumentRecord = {
      ...document,
      status: 'Signed',
      events: [
        ...document.events,
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-GB'),
          actor: currentUser.name,
          role: currentUser.role,
          event: 'Protected signing executed',
          details: `Signed with Tide distributed authorization credentials. Token #TD-${Math.floor(10000 + Math.random() * 90000)} locked to hash ${document.fileHash.slice(0, 16)}`,
          tone: 'green'
        }
      ]
    };

    onUpdateDocument(updated);
    onShowToast(
      lang === 'vi' ? 'Chứng từ đã được ký mật mã' : 'Document Cryptographically Signed',
      lang === 'vi' ? `${document.name} đã được ký và niêm phong mật mã thành công.` : `${document.name} signed successfully under authorized quorum.`,
      'success'
    );
    onAddAuditLog(
      'Protected Signing Executed',
      `${document.id} signed by ${currentUser.name} (${currentUser.role}). Version locked to ${document.fileHash}`,
      'Signed',
      'green'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-xs">
              {document.fileExt}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base truncate">
                  {document.name}
                </h3>
                <span className={`
                  px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0
                  ${document.status === 'Signed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                  ${document.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                  ${document.status === 'Needs Review' ? 'bg-rose-50 text-rose-700 border border-rose-200' : ''}
                  ${document.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                  ${document.status === 'Validation Passed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : ''}
                `}>
                  {translateStatus(document.status)}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                <span>{document.id}</span>
                <span>·</span>
                <span>{document.type}</span>
                <span>·</span>
                <span>{document.counterparty}</span>
                <span>·</span>
                <span className="font-mono">v{document.version}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Tabs */}
        <div className="px-5 border-b border-slate-200 flex items-center gap-4 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'reconciliation'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{t.drawer.tabRecon}</span>
            {matchingResult.discrepancyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {matchingResult.discrepancyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.drawer.tabPreview}</span>
          </button>

          <button
            onClick={() => setActiveTab('integrity')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'integrity'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t.drawer.tabIntegrity}</span>
            {document.isTampered && (
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                {lang === 'vi' ? 'Vi phạm' : 'Breach'}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.drawer.tabTimeline}</span>
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: 3-Way Reconciliation */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-5">
              {/* AI Discrepancy Overview Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                matchingResult.isFullyMatched
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                {matchingResult.isFullyMatched ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
                    {matchingResult.isFullyMatched ? t.drawer.cleanReconTitle : t.drawer.mismatchTitle}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {matchingResult.summaryMessage}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold">
                    <span>{t.drawer.matchScore} <strong>{matchingResult.matchScore}%</strong></span>
                    <span>·</span>
                    <span>{t.drawer.recAction} <strong className="underline">{matchingResult.recommendedAction}</strong></span>
                  </div>
                </div>

                <button
                  onClick={handleRerunMatch}
                  disabled={isSimulatingAI}
                  className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingAI ? 'animate-spin' : ''}`} />
                  <span>{t.drawer.recheckBtn}</span>
                </button>
              </div>

              {/* Linked Baseline Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">{t.drawer.baselinePo}</div>
                  <div className="font-bold text-slate-900 mt-1">{linkedPo ? linkedPo.referenceNumber : (lang === 'vi' ? 'Chưa liên kết PO' : 'No PO Linked')}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {linkedPo ? `${formatCurrency(linkedPo.amount, linkedPo.currency)} · ${t.common.status}: ${translateStatus(linkedPo.status)}` : (lang === 'vi' ? 'Tải lên hoặc chọn PO để đối chiếu' : 'Upload or link PO')}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">{t.drawer.warehouseGrn}</div>
                  <div className="font-bold text-slate-900 mt-1">{linkedGrn ? linkedGrn.referenceNumber : 'GRN-8841 (Bonded Port)'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'vi' ? 'Kho ngoại quan Cảng Hải Phòng · Đã kiểm đếm' : 'Hai Phong Port Warehouse · Physical intake verified'}
                  </div>
                </div>
              </div>

              {/* Line Items Comparison Matrix */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                  {t.drawer.parityTableTitle}
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                        <th className="py-2 px-3">{t.drawer.colItem}</th>
                        <th className="py-2 px-2 text-center">{t.drawer.colPoQty}</th>
                        <th className="py-2 px-2 text-center">{t.drawer.colGrnQty}</th>
                        <th className="py-2 px-2 text-center">{t.drawer.colInvQty}</th>
                        <th className="py-2 px-3 text-right">{t.drawer.colVariance}</th>
                        <th className="py-2 px-3 text-right">{t.drawer.colPrice}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matchingResult.items.map((item, idx) => {
                        const isMismatch = item.status !== 'match';
                        return (
                          <tr key={idx} className={isMismatch ? 'bg-rose-50/50' : 'hover:bg-slate-50/50'}>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{item.itemCode}</div>
                              <div className="text-[11px] text-slate-500">{item.description}</div>
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                              {item.poQty}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                              {item.grnQty}
                            </td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold ${isMismatch ? 'text-rose-700' : 'text-slate-900'}`}>
                              {item.invQty}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {item.qtyDiff !== 0 ? (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  {item.qtyDiff > 0 ? `+${item.qtyDiff}` : item.qtyDiff} pcs
                                </span>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-semibold">{lang === 'vi' ? 'Khớp 0' : 'Parity 0'}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                              ${item.invPrice.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Policy Explanation Note */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>{t.drawer.policyNoticeTitle}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {t.drawer.policyNoticeDesc}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Official Document Paper Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-sm font-sans space-y-5 text-slate-800 relative">
                {document.status === 'Signed' && (
                  <div className="absolute right-8 top-12 border-2 border-emerald-600 text-emerald-700 font-extrabold text-sm px-4 py-1.5 rounded-lg rotate-12 uppercase tracking-widest opacity-80 pointer-events-none">
                    {t.drawer.paperStampSigned}
                  </div>
                )}
                {document.isTampered && (
                  <div className="absolute right-8 top-12 border-2 border-rose-600 text-rose-700 font-extrabold text-sm px-4 py-1.5 rounded-lg rotate-12 uppercase tracking-widest opacity-80 pointer-events-none">
                    {t.drawer.paperStampTampered}
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                      {document.type}
                    </h2>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      REF: {document.referenceNumber} · ID: {document.id}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-900">{document.counterparty}</div>
                    <div className="text-slate-500">{document.metadata.originCountry || 'International Trade'}</div>
                    <div className="text-slate-500">{lang === 'vi' ? 'Ngày lập' : 'Date'}: {document.updatedDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.drawer.buyerImporter}</div>
                    <div className="font-bold text-slate-800">Atlas Components Vietnam JSC</div>
                    <div className="text-slate-600">{lang === 'vi' ? 'Khu Công Nghiệp Đình Vũ, Hải Phòng, Việt Nam' : 'Dinh Vu Industrial Zone, Hai Phong, Vietnam'}</div>
                    <div className="text-slate-600">Tax ID: 0201889412</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.drawer.shipmentMetadata}</div>
                    <div className="text-slate-700">Container: <span className="font-mono">{document.metadata.containerNo || 'MSCU-991204'}</span></div>
                    <div className="text-slate-700">Incoterms: <span className="font-semibold">{document.metadata.incoterms || 'CIF Hai Phong'}</span></div>
                    <div className="text-slate-700">{lang === 'vi' ? 'Thanh toán' : 'Payment'}: {document.metadata.paymentTerms || 'Net 30 Days'}</div>
                  </div>
                </div>

                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-300 font-bold text-slate-600 text-[11px]">
                      <th className="py-1">{lang === 'vi' ? 'Mô tả hàng hóa' : 'Description'}</th>
                      <th className="py-1 text-center">{lang === 'vi' ? 'Số lượng' : 'Quantity'}</th>
                      <th className="py-1 text-right">{lang === 'vi' ? 'Đơn giá' : 'Unit Price'}</th>
                      <th className="py-1 text-right">{lang === 'vi' ? 'Thành tiền' : 'Total'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {document.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-2">
                          <div className="font-bold text-slate-900">{item.itemCode}</div>
                          <div className="text-[11px] text-slate-500">{item.description}</div>
                        </td>
                        <td className="py-2 text-center font-mono font-bold">
                          {item.invoiceQuantity ?? item.poQuantity} {item.unit}
                        </td>
                        <td className="py-2 text-right font-mono">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2 text-right font-mono font-bold">
                          ${item.lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 font-bold text-xs">
                      <td colSpan={3} className="py-2 text-right text-slate-600">{lang === 'vi' ? 'Tổng giá trị chứng từ:' : 'Total Document Value:'}</td>
                      <td className="py-2 text-right font-mono text-slate-900 text-sm">
                        {formatCurrency(document.amount, document.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>CargoTrust Distributed Gateway Record</span>
                  <span>{document.fileHash}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cryptographic Integrity & Tamper Testing */}
          {activeTab === 'integrity' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">{t.drawer.fingerprintTitle}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    document.isTampered
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {document.isTampered ? t.drawer.fingerprintMismatch : t.drawer.fingerprintValid}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg break-all">
                  {document.fileHash}
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  {t.drawer.fingerprintExplain}
                </div>
              </div>

              {/* Interactive Tampering Sandbox Tool */}
              <div className="p-4 border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">{t.drawer.experimentTitle}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {t.drawer.experimentDesc}
                </p>
                <button
                  onClick={handleToggleTamper}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    document.isTampered
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-rose-700 hover:bg-rose-800 text-white'
                  }`}
                >
                  {document.isTampered ? t.drawer.btnRestore : t.drawer.btnTamper}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Audit History */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'vi' ? `Nhật ký sự kiện bất biến (${document.events.length} bản ghi)` : `Immutable Event Log (${document.events.length} records)`}
              </div>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {document.events.map((ev) => (
                  <div key={ev.id} className="relative">
                    <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                      ev.tone === 'red' ? 'bg-rose-500' :
                      ev.tone === 'amber' ? 'bg-amber-500' :
                      ev.tone === 'green' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{ev.event}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {lang === 'vi' ? 'Người thực hiện' : 'Actor'}: {ev.actor} ({ev.role})
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {ev.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Protected Signing Action Gate */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            {t.common.activePersona}: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              {t.common.close}
            </button>

            {document.status !== 'Signed' ? (
              <button
                onClick={handleRequestSigning}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.drawer.executeSignBtn}</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.drawer.signedSuccessBadge}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
