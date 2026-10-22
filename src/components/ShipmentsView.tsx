import React, { useState } from 'react';
import { ShipmentRecord, OrderRecord } from '../types';
import { Language } from '../i18n/translations';
import { 
  Ship, 
  Search, 
  CheckCircle2, 
  Clock, 
  Anchor, 
  MapPin, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ShipmentsViewProps {
  orders: OrderRecord[];
  lang: Language;
  onSelectOrder: (orderId: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({
  orders,
  lang,
  onSelectOrder,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten shipments from all orders
  const allShipments = orders.flatMap(order => 
    order.shipments.map(shp => ({
      ...shp,
      orderTitle: order.title,
      orderNumber: order.orderNumber,
      orderCommodity: order.commodityType,
      orderValue: order.totalValue,
      orderCurrency: order.currency
    }))
  );

  const filteredShipments = allShipments.filter(s => 
    s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.vesselOrFlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Port Arrived': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Customs Cleared': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Transit': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'vi' ? 'Theo Dõi Đợt Vận Chuyển (Shipments)' : 'Logistics Shipments & Deliveries'}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {allShipments.length} {lang === 'vi' ? 'đợt giao' : 'shipments'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'vi'
              ? 'Quản lý lịch trình, container, cảng bốc dỡ và liên kết trực tiếp với Đơn hàng ngoại thương.'
              : 'Track voyages, containers, ports of entry and direct bindings to commercial orders.'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'vi' 
              ? 'Tìm kiếm theo mã đợt giao (SHP-...), hãng tàu, số container, cảng đi/đến...' 
              : 'Search by shipment number, carrier, container, route...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Shipments List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShipments.map((shp) => (
          <div key={shp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {shp.shipmentNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(shp.status)}`}>
                  {shp.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Ship className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{shp.carrier} · {shp.vesselOrFlight}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{shp.origin} → {shp.destination}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{lang === 'vi' ? 'Container / Niêm phong:' : 'Container / Seal:'}</span>
                  <span className="font-mono font-bold text-slate-800">{shp.containerNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{lang === 'vi' ? 'Khởi hành / Đến:' : 'ETD / ETA:'}</span>
                  <span className="text-slate-700 font-medium">{shp.etd} → {shp.eta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{lang === 'vi' ? 'Đơn hàng liên kết:' : 'Bound Order:'}</span>
                  <span className="font-mono font-bold text-blue-700">{shp.orderNumber}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {shp.documentCount} {lang === 'vi' ? 'chứng từ gắn kèm' : 'linked docs'}
              </span>
              <button
                onClick={() => onSelectOrder(shp.orderId)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>{lang === 'vi' ? 'Xem trong Đơn hàng' : 'Open in Order'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
