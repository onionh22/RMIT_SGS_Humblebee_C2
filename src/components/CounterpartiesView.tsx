import React, { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import { Counterparty } from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface CounterpartiesViewProps {
  counterparties: Counterparty[];
  lang: Language;
  onAddCounterparty: (cp: Counterparty) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const CounterpartiesView: React.FC<CounterpartiesViewProps> = ({
  counterparties,
  lang,
  onAddCounterparty,
  onShowToast
}) => {
  const t = TRANSLATIONS[lang];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Counterparty['type']>('Supplier');
  const [country, setCountry] = useState('Vietnam');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCp: Counterparty = {
      id: `CP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      code: name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() + '-VN',
      type,
      country,
      countryCode: country === 'Vietnam' ? 'VN' : 'GLOBAL',
      status: 'Pending Verification',
      linkedDocsCount: 0,
      contactEmail: email || `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      trustScore: 85
    };

    onAddCounterparty(newCp);
    onShowToast(
      lang === 'vi' ? 'Đã đăng ký đối tác' : 'Counterparty Registered',
      lang === 'vi' ? `${newCp.name} đã được thêm vào sổ bộ đối tác.` : `${newCp.name} added to workspace directory.`,
      'success'
    );
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Sổ Bộ Đối Tác Ngoại Thương & Chỉ Số Tin Cậy' : 'Counterparty Trust Register'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'vi' 
              ? 'Xác thực nhà cung ứng, người mua, hãng tàu và đơn vị giao nhận trong mạng lưới chuỗi cung ứng.'
              : 'Verified suppliers, buyers, forwarders, and ocean carriers in the distributed supply chain network.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Thêm Đối Tác Thương Mại' : 'Add Trading Partner'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counterparties.map((cp) => (
          <div key={cp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                  {cp.code.slice(0, 3)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cp.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {cp.status === 'Verified' ? (lang === 'vi' ? 'Đã xác thực' : 'Verified') : (lang === 'vi' ? 'Chờ xác thực' : 'Pending Verification')}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{cp.name}</h3>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{cp.type}</span>
                <span>·</span>
                <span>{cp.country}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Liên hệ:' : 'Contact:'}</span>
                  </span>
                  <span className="font-mono text-slate-800 truncate max-w-[170px]">{cp.contactEmail}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-400">{lang === 'vi' ? 'Chứng từ liên kết:' : 'Linked Documents:'}</span>
                  <strong className="text-slate-800">{cp.linkedDocsCount} {lang === 'vi' ? 'bản ghi' : 'records'}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                {lang === 'vi' ? 'Điểm tin cậy:' : 'Trust Index:'} <strong className="text-emerald-700">{cp.trustScore}/100</strong>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{cp.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'vi' ? 'Đăng Ký Đối Tác Thương Mại Mới' : 'Register Trading Partner'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                aria-label={t.common.close}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Tên Doanh nghiệp / Tổ chức' : 'Company / Entity Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pacific Electronics Corp."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'vi' ? 'Vai trò trong chuỗi' : 'Role in Trade'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Supplier">{lang === 'vi' ? 'Nhà cung ứng (Bên bán)' : 'Supplier (Seller)'}</option>
                    <option value="Buyer">{lang === 'vi' ? 'Người mua (Bên nhập khẩu)' : 'Buyer (Importer)'}</option>
                    <option value="Carrier">{lang === 'vi' ? 'Hãng tàu / Hãng bay' : 'Ocean/Air Carrier'}</option>
                    <option value="Freight forwarder">{lang === 'vi' ? 'Đơn vị giao nhận' : 'Freight Forwarder'}</option>
                    <option value="Customs broker">{lang === 'vi' ? 'Đại lý hải quan' : 'Customs Broker'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'vi' ? 'Quốc gia' : 'Country'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Japan"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Email liên hệ vận hành' : 'Contact Email'}
                </label>
                <input
                  type="email"
                  placeholder="operations@partner.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-[11px] leading-relaxed">
                {lang === 'vi' 
                  ? 'Đối tác đăng ký mới sẽ được xác minh chứng thư số và đối chiếu danh sách cấm vận quốc tế trước khi kích hoạt luồng tự động.'
                  : 'Registered counterparties are verified via digital certificates and cross-checked against international sanctions lists before receiving automated trade execution.'}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  {lang === 'vi' ? 'Lưu Đối Tác' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
