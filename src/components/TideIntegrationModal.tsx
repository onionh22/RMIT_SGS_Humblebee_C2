import React, { useState } from 'react';
import { Copy, Check, Lock } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface TideIntegrationModalProps {
  lang: Language;
  onClose: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const TideIntegrationModal: React.FC<TideIntegrationModalProps> = ({
  lang,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const mcpCommand = 'chatgpt mcp add tide --transport http https://mcp.tide.org/mcp';
  const t = TRANSLATIONS[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpCommand);
    setCopied(true);
    onShowToast(
      lang === 'vi' ? 'Đã sao chép lệnh' : 'Command Copied',
      lang === 'vi' ? 'Dán lệnh vào terminal hoặc cấu hình MCP client.' : 'Paste into your terminal / MCP configuration environment.',
      'success'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'vi' ? 'Kiến Trúc Phân Quyền Phân Tán CargoTrust' : 'CargoTrust Distributed Authority Architecture'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'vi' ? 'Thiết kế TideCloak & Cổng Thực Thi Ký Duyệt Mật Mã' : 'TideCloak & Cryptographic Execution Gateway Blueprint'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
            aria-label={t.common.close}
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Architectural Flow Diagram */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3 font-mono text-[11px]">
            <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
              {lang === 'vi' ? 'LUỒNG THỰC THI BẢO MẬT PHÂN TÁN' : 'PROTECTED EXECUTION PIPELINE'}
            </div>
            <div className="space-y-1 leading-relaxed">
              <div>Frontend (React 19 + Tailwind CSS)</div>
              <div className="text-slate-500">  │</div>
              <div>  ▼</div>
              <div>Backend API & CargoTrust Engine</div>
              <div className="text-slate-500">  ├─► {lang === 'vi' ? 'AI Phân tích Chứng từ (OCR / Đối chiếu 3 chiều)' : 'AI Document Intelligence (OCR / 3-Way Match)'}</div>
              <div className="text-slate-500">  ├─► {lang === 'vi' ? 'Policy Engine (Nguyên tắc Maker-Checker / Quorum)' : 'Policy Engine (Maker-Checker / Quorum Rules)'}</div>
              <div className="text-slate-500">  └─► {lang === 'vi' ? 'Cổng Xác thực TideCloak' : 'TideCloak Authorization Gateway'}</div>
              <div className="text-slate-500">        │</div>
              <div className="text-slate-500">        ▼</div>
              <div className="text-emerald-400 font-bold">  {lang === 'vi' ? 'Ký duyệt Mật mã & Neo Sổ cái Phân tán' : 'Protected Cryptographic Signing & Ledger Anchor'}</div>
            </div>
          </div>

          {/* Step 1: Remote MCP Server */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">1</span>
              <span>{lang === 'vi' ? 'Cấu hình Máy chủ Tide MCP từ xa' : 'Add Remote Tide MCP Server'}</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {lang === 'vi' 
                ? 'Cung cấp cho coding agent tài liệu SDK và hướng dẫn API chính thức để tích hợp TideCloak và quyền hạn phi tập trung:'
                : 'Equips your coding agent with verified SDK and API documentation for TideCloak and decentralized authority operations:'}
            </p>
            <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between gap-2 font-mono text-[11px] text-slate-800">
              <span className="truncate">{mcpCommand}</span>
              <button
                onClick={handleCopy}
                className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 font-sans font-bold text-[10px] rounded border border-slate-300 shrink-0 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (lang === 'vi' ? 'Đã chép' : 'Copied') : (lang === 'vi' ? 'Sao chép' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Step 2: TideCloak Setup */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">2</span>
              <span>{lang === 'vi' ? 'Thiết lập Realm & OIDC TideCloak' : 'TideCloak Realm & OIDC Setup'}</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {lang === 'vi' 
                ? 'Tạo realm doanh nghiệp, định nghĩa vai trò (Mua hàng, Vận hành, Tài chính, Đại lý AI), cấu hình URI chuyển hướng và thiết lập trao đổi token máy chủ - máy chủ an toàn.'
                : 'Create an enterprise realm, define roles (Procurement, Operations, Finance, AI Agent), configure redirect URIs, and establish server-to-server token exchange. Client secrets remain securely server-side.'}
            </p>
          </div>

          {/* Step 3: Blockchain and Merkle Tree Proofs */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">3</span>
              <span>{lang === 'vi' ? 'Neo Bằng Chứng Trên Blockchain (Cấp độ 2)' : 'Blockchain Evidence Anchoring (Optional Level 2)'}</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {lang === 'vi' 
                ? 'Theo Mục VII trong tài liệu hướng dẫn, blockchain lưu giữ mã băm (hash), số hiệu phiên bản và chữ ký điện tử thay vì lưu toàn bộ tệp hợp đồng PDF riêng tư, đảm bảo tính bảo mật thương mại.'
                : 'As detailed in Section VII of the guideline, the blockchain stores hashes, version fingerprints, and signatory addresses rather than entire private PDF contracts. This ensures cross-company verification without compromising commercial privacy.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
