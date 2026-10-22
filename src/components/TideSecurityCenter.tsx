import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Key, 
  Cpu, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Fingerprint, 
  Network, 
  Activity, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface TideSecurityCenterProps {
  lang: Language;
  onNavigate: (page: string) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

interface TideNode {
  id: string;
  name: string;
  region: string;
  status: 'ONLINE' | 'CONSENSUS_READY' | 'SYNCING';
  latencyMs: number;
  lastHeartbeat: string;
  shareIndex: number;
}

interface CapabilityToken {
  id: string;
  scope: string;
  targetPackage: string;
  authorizedTenant: string;
  thresholdMet: '2/2 Quorum' | '3/3 Multi-Region';
  signers: string[];
  expiresInMinutes: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  capabilityHash: string;
}

const INITIAL_NODES: TideNode[] = [
  { id: 'node-us-01', name: 'Tide-Consensus-US-East', region: 'us-east-1 (N. Virginia)', status: 'CONSENSUS_READY', latencyMs: 14, lastHeartbeat: 'Vừa xong', shareIndex: 1 },
  { id: 'node-eu-01', name: 'Tide-Validator-EU-Central', region: 'eu-central-1 (Frankfurt)', status: 'CONSENSUS_READY', latencyMs: 28, lastHeartbeat: 'Vừa xong', shareIndex: 2 },
  { id: 'node-ap-01', name: 'Tide-Gateway-APAC-Tokyo', region: 'ap-northeast-1 (Tokyo)', status: 'CONSENSUS_READY', latencyMs: 35, lastHeartbeat: 'Vừa xong', shareIndex: 3 },
  { id: 'node-val-02', name: 'Tide-Independent-Witness', region: 'ch-zurich-1 (Zurich Vault)', status: 'CONSENSUS_READY', latencyMs: 22, lastHeartbeat: 'Vừa xong', shareIndex: 4 },
];

const INITIAL_TOKENS: CapabilityToken[] = [
  {
    id: 'CAP-2026-901',
    scope: 'SEMICONDUCTOR_EVIDENCE_READ',
    targetPackage: 'PKG-SEMI-2026-A1',
    authorizedTenant: 'tenant-pacific-avionics (Pacific Avionics)',
    thresholdMet: '2/2 Quorum',
    signers: ['Sarah Chen (Supplier Admin)', 'Dr. Elena Vance (Compliance Officer)'],
    expiresInMinutes: 48,
    status: 'ACTIVE',
    capabilityHash: '0x8f3c1a992e4b01d...7721fa0c',
  },
  {
    id: 'CAP-2026-884',
    scope: 'TRADE_INVOICE_RELEASE',
    targetPackage: 'ORD-2026-002',
    authorizedTenant: 'tenant-atlas-components',
    thresholdMet: '2/2 Quorum',
    signers: ['Alex Wong (Finance Approver)', 'Gatekeeper Node #2'],
    expiresInMinutes: 12,
    status: 'ACTIVE',
    capabilityHash: '0x3310ac9f7129ee1...b52a101f',
  },
  {
    id: 'CAP-2026-720',
    scope: 'ITAR_RESTRICTED_EXPORT',
    targetPackage: 'PKG-AVIO-770',
    authorizedTenant: 'tenant-pacific-avionics',
    thresholdMet: '2/2 Quorum',
    signers: ['Dr. Elena Vance (Compliance Officer)', 'Marcus Cole (Buyer Witness)'],
    expiresInMinutes: 0,
    status: 'EXPIRED',
    capabilityHash: '0x12a9bc4123defaa...88114400',
  },
];

export const TideSecurityCenter: React.FC<TideSecurityCenterProps> = ({
  lang,
  onNavigate,
  onShowToast,
}) => {
  const [nodes, setNodes] = useState<TideNode[]>(INITIAL_NODES);
  const [tokens, setTokens] = useState<CapabilityToken[]>(INITIAL_TOKENS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleTestConsensusPulse = () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult('Xác thực phân tán thành công: 4/4 nodes Tide trực tuyến. Không phát hiện bất kỳ master key đơn phương nào.');
      onShowToast(
        lang === 'vi' ? 'Đã kiểm tra đồng thuận Tide' : 'Tide Consensus Verified',
        lang === 'vi' ? '4/4 nodes Tide phản hồi đồng thuận ngưỡng an toàn.' : '4/4 Tide nodes healthy with threshold quorum.',
        'success'
      );
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'vi' ? 'QUẢN TRỊ & BẢO MẬT' : 'GOVERNANCE & SECURITY'}
          </div>
          <h1 className="text-2xl font-extrabold text-[#0f294a] tracking-tight mt-1 truncate">
            {lang === 'vi' ? 'Trung tâm Bảo mật TideCloak' : 'TideCloak Security Center'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {lang === 'vi'
              ? 'Kiểm soát thẩm quyền nảy sinh (Emergent Authority), mạng node phân tán và mã năng lực mã hóa.'
              : 'Orchestrating Emergent Authority, distributed threshold nodes, and zero-master-key capability tokens.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('evidence')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'vi' ? 'Xem Bằng chứng Bán dẫn' : 'Evidence Exchange'}</span>
          </button>

          <button
            onClick={handleTestConsensusPulse}
            disabled={isVerifying}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f294a] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? (lang === 'vi' ? 'Đang kiểm tra...' : 'Pinging...') : (lang === 'vi' ? 'Kiểm tra đồng thuận' : 'Verify Consensus')}</span>
          </button>
        </div>
      </div>

      {/* Verification notification */}
      {verificationResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{verificationResult}</span>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">Mạng Nodes Phân Tán</span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">4 / 4</div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            100% Đồng thuận sẵn sàng
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">Ngưỡng Quorum Tối Thiểu</span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">2-of-2</div>
          <div className="text-xs text-slate-400">Supplier Admin + Compliance</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">Master Key Tồn Tại</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 my-2">0 (Zero)</div>
          <div className="text-xs text-slate-400">Không ai nắm quyền đơn phương</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm font-medium">Token Năng Lực Khả Dụng</span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] text-blue-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0f294a] my-2">{tokens.filter(t => t.status === 'ACTIVE').length} Active</div>
          <div className="text-xs text-slate-400">Mã hóa tạm thời theo phiên</div>
        </div>
      </div>

      {/* 2 Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Distributed Nodes (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0f294a]">Cụm Node Tide Phân Tán</h2>
              <p className="text-xs text-slate-400">Cơ chế phân mảnh khóa bí mật Secret Sharing</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Synced
            </span>
          </div>

          <div className="space-y-3">
            {nodes.map(node => (
              <div key={node.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-[#0f294a]">{node.name}</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500">{node.latencyMs}ms</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                  <span>{node.region}</span>
                  <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Share #{node.shareIndex}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-900 leading-relaxed">
            <strong>Nguyên lý bảo mật:</strong> Dữ liệu giải mã chỉ được tái tạo khi nhận đủ các mảnh khóa độc lập từ ngưỡng Quorum. Nếu 1 hoặc 2 node bị tấn công, kẻ gian vẫn không thể thu được bất kỳ thông tin nào.
          </div>
        </div>

        {/* Right: Capability Tokens Ledger (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0f294a]">Sổ Cái Token Năng Lực (Capability Tokens)</h2>
              <p className="text-xs text-slate-400">Thẩm quyền nảy sinh sinh ra sau khi 2 bên ký duyệt</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{tokens.length} records</span>
          </div>

          <div className="space-y-3">
            {tokens.map(token => (
              <div key={token.id} className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700">{token.id}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-800">{token.scope}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    token.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {token.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <div><strong>Mục tiêu:</strong> {token.targetPackage} ({token.authorizedTenant})</div>
                  <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Các bên đồng ký: {token.signers.join(', ')}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Proof: {token.capabilityHash}</span>
                  <span>{token.status === 'ACTIVE' ? `Hết hạn sau: ${token.expiresInMinutes}p` : 'Đã thu hồi'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Thử nghiệm xác thực bằng chứng bán dẫn:</span>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Mở Kho Bằng Chứng Bán Dẫn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
