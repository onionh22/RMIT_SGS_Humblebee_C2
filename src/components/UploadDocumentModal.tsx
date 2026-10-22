import React, { useState } from 'react';
import { Upload, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { DocumentRecord, DocumentType, Counterparty, UserSession } from '../types';
import { calculateDocumentFingerprint } from '../utils/policyEngine';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface UploadDocumentModalProps {
  counterparties: Counterparty[];
  existingPos: DocumentRecord[];
  currentUser: UserSession;
  lang: Language;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentRecord) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  counterparties,
  existingPos,
  currentUser,
  lang,
  onClose,
  onUploadSuccess,
  onShowToast
}) => {
  const t = TRANSLATIONS[lang];
  const [docType, setDocType] = useState<DocumentType>('Commercial Invoice');
  const [counterparty, setCounterparty] = useState(counterparties[0]?.name || 'Nippon Components Ltd.');
  const [refNumber, setRefNumber] = useState('INV-2410');
  const [amount, setAmount] = useState('16885.00');
  const [linkedPo, setLinkedPo] = useState(existingPos[0]?.referenceNumber || 'PO-1182');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(lang === 'vi' ? 'Khởi tạo luồng tiếp nhận chứng từ ngoại thương...' : 'Initializing document ingest pipeline...');

    setTimeout(() => {
      setProcessingStep(lang === 'vi' ? 'Đang trích xuất dữ liệu dòng hàng qua OCR & AI...' : 'Extracting structured trade metadata via OCR & LLM...');
      setTimeout(() => {
        setProcessingStep(lang === 'vi' ? 'Đang tính toán dấu vân tay SHA-256 & đối chiếu PO gốc...' : 'Calculating SHA-256 fingerprint & validating baseline...');
        setTimeout(() => {
          setIsProcessing(false);

          const fileName = selectedFile ? selectedFile.name : `${docType.replace(/\s+/g, '_')}_${refNumber}.pdf`;
          const numAmount = parseFloat(amount) || 16885;
          const hash = calculateDocumentFingerprint(`${fileName}-${refNumber}-${Date.now()}`);

          const newDoc: DocumentRecord = {
            id: `DOC-${Math.floor(2410 + Math.random() * 90)}`,
            name: fileName,
            type: docType,
            fileExt: 'PDF',
            referenceNumber: refNumber,
            counterparty,
            updatedDate: lang === 'vi' ? 'Vừa xong' : 'Just now',
            amount: numAmount,
            currency: 'USD',
            status: docType === 'Commercial Invoice' ? 'Pending Approval' : 'Validation Passed',
            ownerId: currentUser.id,
            ownerName: currentUser.name,
            linkedPoRef: docType === 'Commercial Invoice' ? linkedPo : undefined,
            version: '1.0',
            fileHash: hash,
            isTampered: false,
            description: lang === 'vi' 
              ? `Được tải lên và bóc tách bởi ${currentUser.name}. Đã đối chiếu với sổ cái không gian làm việc.`
              : `Uploaded and extracted by ${currentUser.name}. Reconciled against workspace ledger.`,
            lineItems: [
              {
                id: `li-${Date.now()}-1`,
                itemCode: 'MCU-STM32F4-LQFP',
                description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
                poQuantity: 220,
                invoiceQuantity: 220,
                unitPrice: 76.75,
                currency: 'USD',
                unit: 'pcs',
                lineTotal: numAmount,
                varianceStatus: 'matched'
              }
            ],
            events: [
              {
                id: `ev-${Date.now()}-1`,
                timestamp: lang === 'vi' ? 'Vừa xong' : 'Just now',
                actor: currentUser.name,
                role: currentUser.role,
                event: 'Document uploaded',
                details: `File ${fileName} ingested into CargoTrust gateway.`,
                tone: 'blue'
              },
              {
                id: `ev-${Date.now()}-2`,
                timestamp: lang === 'vi' ? 'Vừa xong' : 'Just now',
                actor: 'CargoTrust AI',
                role: 'AI Agent',
                event: 'Automated 3-Way Extraction',
                details: `Extracted 1 line item. Matched with ${linkedPo}. Fingerprint generated.`,
                tone: 'green'
              }
            ],
            metadata: {
              originCountry: 'Japan',
              destinationCountry: 'Vietnam',
              incoterms: 'CIF Hai Phong',
              paymentTerms: 'Net 30 Days'
            }
          };

          onUploadSuccess(newDoc);
          onShowToast(
            lang === 'vi' ? 'Chứng từ đã bóc tách thành công' : 'Document Processed',
            lang === 'vi' ? `${fileName} đã được bóc tách và tạo mã băm SHA-256 an toàn.` : `${fileName} extracted and fingerprinted successfully.`,
            'success'
          );
          onClose();
        }, 600);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t.uploadModal.title}</h3>
            <p className="text-xs text-slate-500">{t.uploadModal.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
            aria-label={t.common.close}
          >
            ×
          </button>
        </div>

        {isProcessing ? (
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <div>
              <div className="font-bold text-slate-800 text-sm">
                {lang === 'vi' ? 'Đang Xử Lý Chứng Từ Ngoại Thương' : 'Processing Document Payload'}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono">{processingStep}</div>
            </div>
            <div className="w-48 bg-slate-100 rounded-full h-1.5 mx-auto overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* File Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/60 transition-colors cursor-pointer"
              onClick={() => document.getElementById('trade-file-input')?.click()}
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="font-bold text-slate-800">
                {selectedFile ? selectedFile.name : t.uploadModal.dropPrompt}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {t.uploadModal.dropFormat}
              </div>
              <input
                id="trade-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            {/* Document Type & Reference */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.uploadModal.docType}</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Commercial Invoice">{t.docTypes.invoice}</option>
                  <option value="Purchase Order">{t.docTypes.po}</option>
                  <option value="Goods Receipt Note">{t.docTypes.grn}</option>
                  <option value="Sales Contract">{t.docTypes.contract}</option>
                  <option value="Bill of Lading">{t.docTypes.bl}</option>
                  <option value="Packing List">{t.docTypes.pl}</option>
                  <option value="Certificate of Origin">{t.docTypes.co}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.uploadModal.refNumber}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-2410"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Counterparty & Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.uploadModal.counterparty}</label>
                <select
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {counterparties.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.uploadModal.amount}</label>
                <input
                  type="number"
                  placeholder="e.g. 16885.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Linked Baseline PO */}
            {docType === 'Commercial Invoice' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.uploadModal.linkPo}</span>
                </label>
                <select
                  value={linkedPo}
                  onChange={(e) => setLinkedPo(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {existingPos.map(po => (
                    <option key={po.id} value={po.referenceNumber}>
                      {po.referenceNumber} - {po.counterparty} (${po.amount?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guidance banner */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>{t.uploadModal.aiNote}</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.uploadModal.uploadAndExtractBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
