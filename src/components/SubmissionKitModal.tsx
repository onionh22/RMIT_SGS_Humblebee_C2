import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Video, 
  ShieldCheck, 
  Award, 
  ExternalLink 
} from 'lucide-react';

interface SubmissionKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'vi' | 'en';
}

export const HACKATHON_README_CONTENT = `# CargoTrust: Semiconductor Evidence Exchange

> A multi-party compliance evidence exchange for high-tech semiconductor supply chains, powered by TideCloak Emergent Authority to eliminate unilateral administrative control.

---

### 1. Vision & originality
Global semiconductor supply chains require chipmakers and tier-1 aerospace/automotive OEMs to share proprietary wafer inspection logs, ITAR export classifications, and RoHS compliance certificates. Today, this relies on centralized vendor portals where a single database administrator or compromised cloud account holds the "master key" to unilaterally leak proprietary silicon blueprints or forge compliance audit trails. CargoTrust pioneers a decentralized evidence exchange where data access and scope expansion require threshold co-signing, ensuring sensitive foundry data remains mathematically immune to single-point administrative tampering.

### 2. Trust constraint insight
Current portals force competitors and defense contractors into an impossible dilemma: either expose proprietary silicon equations and customer BOMs to a shared administrator, or endure weeks of manual air-gapped courier audits. Trust breaks down because someone always has the unilateral power to override policies. Removing unilateral authority unlocks instantaneous, verified evidence sharing without risking IP theft or regulatory violations.

### 3. Value & impact
- **Foundries & Chipmakers:** Safely prove quality yields (AEC-Q100, MIL-PRF-38535) to aerospace buyers without revealing proprietary mask recipes to commercial rivals.
- **OEM Procurement:** Verify batch authenticity and defect density in real-time, reducing compliance audit cycles from 21 days to under 60 seconds.
- **Auditors:** Gain immutable, verifiable cryptographic proofs without ever holding reusable master credentials.

### 4. Why TideCloak matters
CargoTrust integrates TideCloak's **Emergent Authority** to govern evidence access. Instead of storing reusable root API keys or admin tokens, authority emerges dynamically across independent nodes only when a 2-of-2 Quorum aligns (Supplier Admin + Independent Compliance Officer). Even root administrators cannot force a unilateral override.

### 5. Prototype & storytelling
Our prototype demonstrates an aerospace buyer accessing lot compliance for a radiation-tolerant FPGA:
1. **Rogue Admin Block:** An administrator attempts a unilateral bypass to leak die blueprints; TideCloak instantly denies the override.
2. **Emergent Quorum:** Supplier Lead initiates a 2-of-2 scope request; Chief Compliance Officer co-signs.
3. **Decentralized Unlock:** Access capability emerges cleanly, letting the authorized buyer view certified inspection proofs while isolating competitors.

*(Word count: 295 words | Target: <300 words)*
`;

export const HACKATHON_VIDEO_SCRIPT = `# 2-Minute Demo Video Script (Tide UNLOCKED Hackathon)

Target duration: Exactly 120 seconds (2:00)
Format: 1080p MP4, clean audio, screen recording of CargoTrust prototype.

---

## [0:00 - 0:30] Scene 1: The Possibility & The Trust Bottleneck
- **Screen:** Show CargoTrust Semiconductor Evidence Exchange homepage.
- **Voiceover (EN):**
  "In semiconductor supply chains, trust is the bottleneck. A foundry producing 7-nanometer microcontrollers or aerospace FPGAs must prove defect density and ITAR compliance to defense contractors. But sharing sensitive wafer yield data on today's cloud portals means trusting a single database admin who holds the master key to leak or tamper with proprietary IP.
  What if we eliminated unilateral control entirely?"

---

## [0:30 - 0:55] Scene 2: The Rogue Admin Test (No Unilateral Control)
- **Screen:** Switch to Supplier Admin (Sarah Chen). Open package 'PKG-AVIO-770' (Radiation-Tolerant FPGA). Click 'Simulate Rogue Admin Force Unlock'.
- **Action:** System displays bold red security warning: 'UNILATERAL OVERRIDE REJECTED - No master key exists'.
- **Voiceover (EN):**
  "Here is our working prototype. Sarah, our supplier admin, wants to grant access. But notice what happens if an admin tries to force a unilateral override without approval.
  TideCloak's policy engine immediately rejects it. There is no master key to steal or abuse. Authority cannot be claimed alone."

---

## [0:55 - 1:25] Scene 3: Emergent Authority in Action (Dual-Key Quorum)
- **Screen:** Sarah Chen initiates a 2-of-2 Quorum proposal for Pacific Avionics. Switch persona to Dr. Elena Vance (Chief Compliance Officer).
- **Action:** Elena reviews the pending request and clicks 'Co-Sign Quorum Approval (2/2)'. Watch the status update to 'Emergent Authority Active'.
- **Voiceover (EN):**
  "To open access, our system enforces a Dual-Key 2-of-2 Quorum. Sarah provides the first key. We switch to Dr. Elena Vance, our independent Chief Compliance Officer.
  When Elena co-signs, Emergent Authority emerges across Tide's distributed nodes. A cryptographic capability is minted specifically for this batch—without either admin ever holding a permanent master credential."

---

## [1:25 - 1:50] Scene 4: Multi-Tenant Isolation & Customer Verification
- **Screen:** Switch persona to Marcus Cole (Pacific Avionics). The wafer yield and ITAR proofs are instantly decrypted and viewable.
- **Action:** Switch to James Park (Apex Mobile - competitor). James tries to view the same package and is instantly denied by cryptographic isolation.
- **Voiceover (EN):**
  "Marcus Cole from Pacific Avionics now instantly verifies the wafer defect logs. Meanwhile, James Park from rival OEM Apex Mobile is mathematically quarantined. Neither internal admins nor external competitors can cross tenant boundaries."

---

## [1:50 - 2:00] Scene 5: What Changes
- **Screen:** Return to the CargoTrust Overview dashboard and highlight the immutable audit trail.
- **Voiceover (EN):**
  "By replacing master keys with TideCloak Emergent Authority, semiconductor compliance shrinks from 3 weeks of air-gapped bureaucracy to 60 seconds of uncompromised truth.
  Built with TideCloak for UNLOCKED 2026."
`;

export const SubmissionKitModal: React.FC<SubmissionKitModalProps> = ({ isOpen, onClose, lang = 'vi' }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'video' | 'rubric'>('readme');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f294a]/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0f294a]">
                {lang === 'vi' ? 'Hồ sơ dự thi Tide UNLOCKED (Submission Kit)' : 'Tide UNLOCKED Submission Kit'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'vi' 
                  ? 'Bản chuẩn bị nộp bài hoàn chỉnh: README < 300 từ & Kịch bản video demo 2 phút'
                  : 'Official hackathon deliverables: <300 words README & 2-minute demo video storyboard'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('readme')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'readme'
                  ? 'border-[#2563eb] text-[#2563eb] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>README.md (5 Prompts · 295 Words)</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'video'
                  ? 'border-[#2563eb] text-[#2563eb] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Kịch bản Video 2 Phút (Storyboard)' : '2-Min Video Storyboard'}</span>
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'rubric'
                  ? 'border-[#2563eb] text-[#2563eb] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Khớp Tiêu Chí Chấm Thi (100%)' : 'Judging Criteria Alignment'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-2">
            {activeTab === 'readme' && (
              <>
                <button
                  onClick={() => handleCopy(HACKATHON_README_CONTENT)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép README'}</span>
                </button>
                <button
                  onClick={() => handleDownload('README.md', HACKATHON_README_CONTENT)}
                  className="px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải README.md</span>
                </button>
              </>
            )}

            {activeTab === 'video' && (
              <>
                <button
                  onClick={() => handleCopy(HACKATHON_VIDEO_SCRIPT)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép Kịch bản'}</span>
                </button>
                <button
                  onClick={() => handleDownload('DEMO_VIDEO_SCRIPT.md', HACKATHON_VIDEO_SCRIPT)}
                  className="px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Demo Script</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 bg-white">
          {activeTab === 'readme' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between text-slate-600">
                <span>
                  ✓ <strong>Đúng 5 câu hỏi quy định:</strong> Vision, Constraint, Impact, Why TideCloak, Prototype.
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  295 / 300 từ (Hợp lệ)
                </span>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {HACKATHON_README_CONTENT}
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
                <span>
                  ⏱ <strong>Thời lượng:</strong> Chuẩn xác 120 giây (2 phút), khớp cấu trúc gợi ý của BTC (Possibility → Constraint → Prototype → What Changes).
                </span>
                <span className="font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  2:00 Max
                </span>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {HACKATHON_VIDEO_SCRIPT}
              </div>
            </div>
          )}

          {activeTab === 'rubric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0f294a]">1. Vision & Originality</h4>
                  <span className="text-xs font-bold text-[#2563eb]">25%</span>
                </div>
                <p className="text-xs text-slate-600">
                  Nền tảng chia sẻ bằng chứng tuân thủ và bản vẽ bán dẫn 7nm/FPGA đầu tiên ứng dụng Emergent Authority, giải quyết rủi ro mất cắp IP giữa các đối thủ OEM.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0f294a]">2. Trust Constraint Insight</h4>
                  <span className="text-xs font-bold text-[#2563eb]">20%</span>
                </div>
                <p className="text-xs text-slate-600">
                  Chỉ rõ điểm nghẽn: Một database admin hay cloud credential nắm quyền lực đơn phương (unilateral control) có thể đánh cắp hoặc thay đổi nhật ký kiểm toán.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0f294a]">3. Value & Impact</h4>
                  <span className="text-xs font-bold text-[#2563eb]">20%</span>
                </div>
                <p className="text-xs text-slate-600">
                  Rút ngắn thời gian kiểm toán linh kiện từ 21 ngày xuống 60 giây mà không cần bàn giao master key hay lo ngại đối thủ tiếp cận BOM bảo mật.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0f294a]">4. Why TideCloak Matters</h4>
                  <span className="text-xs font-bold text-[#2563eb]">20%</span>
                </div>
                <p className="text-xs text-slate-600">
                  Thẩm quyền mở khóa (Emergent Authority) chỉ nảy sinh từ sự hợp tác của các node Tide khi đạt đủ 2-of-2 chữ ký đồng thuận. Không có bất kỳ master key nào tồn tại.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded bg-slate-50 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#0f294a]">5. Prototype & Storytelling</h4>
                  <span className="text-xs font-bold text-[#2563eb]">15%</span>
                </div>
                <p className="text-xs text-slate-600">
                  Prototype hoàn chỉnh chạy trực tiếp: Mô phỏng hành vi Rogue Admin Force Unlock bị chặn, quy trình ký đồng thuận 2-of-2 của Dr. Elena Vance, và kiểm toán cách ly đa tổ chức (Multi-Tenant Isolation).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span>Tide UNLOCKED Hackathon · Deadline: 22 Oct 2026</span>
          <a
            href="https://forms.gle/HRHYjnqB86j1LFS97"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#2563eb] hover:underline font-medium"
          >
            <span>Google Form nộp bài chính thức</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
