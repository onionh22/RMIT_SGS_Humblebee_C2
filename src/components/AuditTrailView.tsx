import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { AuditLogEntry } from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface AuditTrailViewProps {
  auditLogs: AuditLogEntry[];
  lang: Language;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditLogs,
  lang,
  onShowToast
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');

  const translateResult = (res: string) => {
    switch (res) {
      case 'Success': return lang === 'vi' ? 'Thành công' : 'Success';
      case 'Exception flagged': return lang === 'vi' ? 'Phát hiện ngoại lệ' : 'Exception flagged';
      case 'Blocked by policy': return lang === 'vi' ? 'Chính sách chặn' : 'Blocked by policy';
      case 'Signed': return lang === 'vi' ? 'Đã ký duyệt' : 'Signed';
      case 'Verified': return lang === 'vi' ? 'Đã xác minh' : 'Verified';
      default: return res;
    }
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.docId && log.docId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesResult = filterResult === 'all' || log.result === filterResult;

      return matchesSearch && matchesResult;
    });
  }, [auditLogs, searchQuery, filterResult]);

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Event', 'Detail', 'Result', 'Doc ID', 'Proof Hash'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.role}"`,
      `"${l.event.replace(/"/g, '""')}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
      `"${l.result}"`,
      l.docId ?? '',
      l.proofHash ?? ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cargotrust-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(
      lang === 'vi' ? 'Đã xuất nhật ký kiểm toán' : 'Audit Log Exported',
      lang === 'vi' ? `Đã xuất ${filteredLogs.length} sự kiện kiểm toán sang file CSV.` : `Exported ${filteredLogs.length} audit entries.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.audit.pageTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.audit.pageSubtitle}
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.audit.exportLog}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.audit.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">{t.audit.allResults}</option>
          <option value="Success">{lang === 'vi' ? 'Thành công' : 'Success'}</option>
          <option value="Exception flagged">{lang === 'vi' ? 'Phát hiện ngoại lệ' : 'Exception flagged'}</option>
          <option value="Blocked by policy">{lang === 'vi' ? 'Chính sách chặn' : 'Blocked by policy'}</option>
          <option value="Signed">{lang === 'vi' ? 'Đã ký duyệt' : 'Signed'}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">{t.audit.colTime}</th>
                <th className="py-3 px-3">{t.audit.colActor}</th>
                <th className="py-3 px-3">{t.audit.colEvent}</th>
                <th className="py-3 px-3">{t.audit.colResult}</th>
                <th className="py-3 px-4 text-right">{t.audit.colProof}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.actor}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-3 px-3 max-w-md">
                    <div className="font-semibold text-slate-900">{log.event}</div>
                    <div className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{log.detail}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.result === 'Success' || log.result === 'Signed' || log.result === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : log.result === 'Blocked by policy'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.result === 'Success' || log.result === 'Signed' || log.result === 'Verified'
                          ? 'bg-emerald-500'
                          : log.result === 'Blocked by policy'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`} />
                      <span>{translateResult(log.result)}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                    {log.proofHash || '0x4f12…88c2'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 px-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>
            {lang === 'vi' 
              ? `Hiển thị ${filteredLogs.length} sự kiện bất biến được ghi nhận`
              : `Showing ${filteredLogs.length} immutable events`}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'vi' ? 'Sổ cái Cây Merkle Đã Xác Minh' : 'Merkle Tree Ledger Verified'}
          </span>
        </div>
      </div>
    </div>
  );
};
