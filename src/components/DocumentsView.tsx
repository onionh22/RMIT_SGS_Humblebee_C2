import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  FileText
} from 'lucide-react';
import { DocumentRecord, DocumentType } from '../types';
import { formatCurrency } from '../utils/policyEngine';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DocumentsViewProps {
  documents: DocumentRecord[];
  lang: Language;
  onOpenDoc: (docId: string) => void;
  onOpenUpload: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  lang,
  onOpenDoc,
  onOpenUpload,
  onShowToast
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || doc.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, searchQuery, selectedType, selectedStatus]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Reference', 'Document Name', 'Type', 'Counterparty', 'Amount', 'Currency', 'Status', 'Version', 'Hash'];
    const rows = filteredDocs.map(d => [
      d.id,
      d.referenceNumber,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.type}"`,
      `"${d.counterparty}"`,
      d.amount ?? 'N/A',
      d.currency,
      d.status,
      d.version,
      d.fileHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cargotrust-documents-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(
      lang === 'vi' ? 'Đã xuất file CSV' : 'CSV Export Generated',
      lang === 'vi' ? `Đã xuất ${filteredDocs.length} bản ghi sang file CSV.` : `Exported ${filteredDocs.length} records to CSV.`,
      'success'
    );
  };

  const docTypes: Array<{ key: DocumentType; label: string }> = [
    { key: 'Purchase Order', label: t.docTypes.po },
    { key: 'Commercial Invoice', label: t.docTypes.invoice },
    { key: 'Goods Receipt Note', label: t.docTypes.grn },
    { key: 'Sales Contract', label: t.docTypes.contract },
    { key: 'Bill of Lading', label: t.docTypes.bl },
    { key: 'Packing List', label: t.docTypes.pl },
    { key: 'Certificate of Origin', label: t.docTypes.co }
  ];

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Sổ Bộ Chứng Từ Ngoại Thương' : 'Trade Document Register'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'vi' 
              ? 'Quản lý hồ sơ vận tải đã xác thực, đối chiếu từng dòng hàng và mã băm phiên bản.'
              : 'Manage authenticated shipping paperwork, line-item reconciliation, and version fingerprints.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.common.exportCsv}</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.common.uploadDocument}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.common.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Document Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">{t.common.allTypes}</option>
          {docTypes.map(tItem => (
            <option key={tItem.key} value={tItem.key}>{tItem.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">{t.common.allStatuses}</option>
          <option value="Approved">{t.statuses.approved}</option>
          <option value="Signed">{t.statuses.signed}</option>
          <option value="Needs Review">{t.statuses.needsReview}</option>
          <option value="Pending Approval">{t.statuses.pendingApproval}</option>
          <option value="Validation Passed">{t.statuses.validationPassed}</option>
        </select>

        {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="text-xs text-blue-700 hover:text-blue-800 font-semibold px-2 py-1"
          >
            {t.common.resetFilters}
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">{lang === 'vi' ? 'Chứng từ / Loại' : 'Document / Type'}</th>
                <th className="py-3 px-3">{t.common.reference}</th>
                <th className="py-3 px-3">{t.common.counterparty}</th>
                <th className="py-3 px-3">{t.common.amount}</th>
                <th className="py-3 px-3">{t.common.status}</th>
                <th className="py-3 px-3">{t.common.fingerprint}</th>
                <th className="py-3 px-4 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center border border-blue-100 shrink-0">
                          {doc.fileExt}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => onOpenDoc(doc.id)}
                            className="font-bold text-slate-900 group-hover:text-blue-700 text-left truncate block"
                          >
                            {doc.name}
                          </button>
                          <div className="text-[11px] text-slate-400">
                            {doc.id} · {doc.type} · v{doc.version}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {doc.referenceNumber}
                      {doc.linkedPoRef && (
                        <div className="text-[10px] text-slate-400 font-sans">
                          PO: {doc.linkedPoRef}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{doc.counterparty}</div>
                      <div className="text-[10px] text-slate-400">{doc.updatedDate}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {formatCurrency(doc.amount, doc.currency)}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`
                        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold
                        ${doc.status === 'Signed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                        ${doc.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                        ${doc.status === 'Needs Review' ? 'bg-rose-50 text-rose-700 border border-rose-200' : ''}
                        ${doc.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                        ${doc.status === 'Validation Passed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          doc.status === 'Signed' ? 'bg-emerald-500' :
                          doc.status === 'Approved' ? 'bg-blue-500' :
                          doc.status === 'Needs Review' ? 'bg-rose-500' :
                          doc.status === 'Pending Approval' ? 'bg-amber-500' : 'bg-slate-500'
                        }`} />
                        <span>{translateStatus(doc.status)}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {doc.isTampered ? (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {t.common.tampered}
                        </span>
                      ) : (
                        <span>{doc.fileHash.slice(0, 16)}…</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenDoc(doc.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        {t.common.details} →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-700">
                      {lang === 'vi' ? 'Không tìm thấy chứng từ' : 'No documents found'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lang === 'vi' ? 'Hãy thử điều chỉnh bộ lọc hoặc tải lên tệp mới.' : 'Try modifying your filter or upload a new trade file.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="p-3 px-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>
            {lang === 'vi' 
              ? `Hiển thị ${filteredDocs.length} trên tổng số ${documents.length} chứng từ đã đăng ký`
              : `Showing ${filteredDocs.length} of ${documents.length} registered documents`}
          </span>
          <span className="text-[11px] font-mono">
            {lang === 'vi' ? 'Kích hoạt chính sách bảo vệ Tide' : 'Tide Policy Enforcement Enabled'}
          </span>
        </div>
      </div>
    </div>
  );
};
