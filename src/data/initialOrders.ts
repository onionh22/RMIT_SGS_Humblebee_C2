import { OrderRecord, ShipmentRecord } from '../types';

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-001',
    title: 'Nhập khẩu vi điều khiển ARM Cortex-M4 (Lô SHP-8841)',
    buyer: 'Atlas Components Vietnam JSC',
    seller: 'Seoul Electronics Ltd.',
    commodityType: 'Linh kiện điện tử (Microcontrollers)',
    contractQuantity: 220,
    unit: 'pcs',
    totalValue: 18420.00,
    currency: 'USD',
    incoterms: 'CIF Hai Phong',
    orderDate: '15 Oct 2026',
    expectedDelivery: '25 Oct 2026',
    paymentTerms: 'L/C at sight, 30 days',
    completeness: 'Chưa đầy đủ',
    completenessCount: { current: 5, total: 6 },
    consistency: 'Cần kiểm tra',
    approval: 'Chờ phê duyệt',
    signing: 'Chờ ký',
    overallStatus: 'Cần kiểm tra',
    checklist: [
      {
        docType: 'Sales Contract',
        required: true,
        docId: 'DOC-SC-001',
        docRef: 'SC-2026-KR',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Đã ký'
      },
      {
        docType: 'Purchase Order',
        required: true,
        docId: 'DOC-2407',
        docRef: 'PO-1182',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Commercial Invoice',
        required: true,
        docId: 'DOC-2408',
        docRef: 'INV-2408',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Phát hiện sai lệch',
        approvalStatus: 'Chưa phê duyệt',
        signingStatus: 'Chờ ký'
      },
      {
        docType: 'Packing List',
        required: true,
        docId: 'DOC-PL-2408',
        docRef: 'PL-2408',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Phát hiện sai lệch',
        approvalStatus: 'Chưa phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Bill of Lading',
        required: true,
        docId: 'DOC-BL-8841',
        docRef: 'BL-8841-BWS',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Đã ký'
      },
      {
        docType: 'Certificate of Origin',
        required: true,
        uploadStatus: 'Chưa có',
        aiReviewStatus: 'Chưa kiểm tra',
        approvalStatus: 'Chưa yêu cầu',
        signingStatus: '—'
      }
    ],
    shipments: [
      {
        id: 'shp-8841-a',
        orderId: 'ord-101',
        shipmentNumber: 'SHP-8841-A',
        origin: 'Busan Port, South Korea',
        destination: 'Hai Phong Port, Vietnam',
        carrier: 'BlueWave Shipping Ltd.',
        vesselOrFlight: 'M/V Pacific Carrier v.12E',
        containerNo: 'TGHU-9921408',
        sealNo: 'BWS-9982',
        etd: '18 Oct 2026',
        eta: '22 Oct 2026',
        status: 'Port Arrived',
        documentCount: 4
      }
    ],
    discrepancies: [
      {
        field: 'Số lượng tính tiền (Quantity Mismatch)',
        sourceA: { docName: 'Purchase Order (PO-1182)', value: '220 pcs' },
        sourceB: { docName: 'Commercial Invoice (INV-2408)', value: '240 pcs' },
        severity: 'HIGH',
        explanation: 'Hóa đơn thương mại INV-2408 có số lượng 240 pcs, cao hơn 20 sản phẩm so với PO-1182 đã duyệt (chênh lệch +$1,535.00). Quy tắc phân quyền số 4 khóa cổng ký duyệt tự động.'
      },
      {
        field: 'Đối chiếu Phiếu đóng gói (Packing List vs Contract)',
        sourceA: { docName: 'Hợp đồng mua bán (SC-2026-KR)', value: '220 pcs' },
        sourceB: { docName: 'Phiếu đóng gói (PL-2408)', value: '240 pcs' },
        severity: 'HIGH',
        explanation: 'Quy cách đóng gói ghi 240 chiếc (12 kiện x 20), trong khi hợp đồng cơ sở chỉ đặt 220 chiếc. Cần lập biên bản sai lệch với hãng tàu và nhà cung cấp.'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-002',
    title: 'Xuất khẩu bộ chuyển đổi nguồn công nghiệp 500W',
    buyer: 'Meridian Trade GmbH',
    seller: 'Atlas Components Vietnam JSC',
    commodityType: 'Thiết bị công nghiệp (Power Modules)',
    contractQuantity: 600,
    unit: 'units',
    totalValue: 42000.00,
    currency: 'USD',
    incoterms: 'FOB Da Nang',
    orderDate: '12 Oct 2026',
    expectedDelivery: '30 Oct 2026',
    paymentTerms: 'Irrevocable L/C at sight',
    completeness: 'Đầy đủ',
    completenessCount: { current: 6, total: 6 },
    consistency: 'Khớp dữ liệu',
    approval: 'Đang rà soát',
    signing: 'Chờ ký',
    overallStatus: 'Chờ phê duyệt',
    checklist: [
      {
        docType: 'Sales Contract',
        required: true,
        docId: 'DOC-2406',
        docRef: 'SC-092',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Chưa phê duyệt',
        signingStatus: 'Chờ ký'
      },
      {
        docType: 'Commercial Invoice',
        required: true,
        docId: 'DOC-INV-092',
        docRef: 'INV-092',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Chờ ký'
      },
      {
        docType: 'Packing List',
        required: true,
        docId: 'DOC-PL-092',
        docRef: 'PL-092',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Bill of Lading',
        required: true,
        docId: 'DOC-BL-9912',
        docRef: 'BL-9912',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Đã ký'
      },
      {
        docType: 'Certificate of Origin',
        required: true,
        docId: 'DOC-CO-092',
        docRef: 'CO-EUR1-092',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Customs Declaration',
        required: true,
        docId: 'DOC-CD-092',
        docRef: 'CD-DN-2026-90',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      }
    ],
    shipments: [
      {
        id: 'shp-092-1',
        orderId: 'ord-102',
        shipmentNumber: 'SHP-092-DE',
        origin: 'Tien Sa Port, Da Nang, Vietnam',
        destination: 'Hamburg Port, Germany',
        carrier: 'Eastport Logistics JSC',
        vesselOrFlight: 'CMA CGM Voltaire v.88',
        containerNo: 'CMAU-8812901',
        etd: '26 Oct 2026',
        eta: '18 Nov 2026',
        status: 'In Transit',
        documentCount: 6
      }
    ],
    discrepancies: []
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-2026-003',
    title: 'Nhập khẩu module rơ-le công nghiệp 24V DC',
    buyer: 'Atlas Components Vietnam JSC',
    seller: 'Nippon Components Ltd.',
    commodityType: 'Phụ tùng điện tử (Industrial Relays)',
    contractQuantity: 150,
    unit: 'pcs',
    totalValue: 9750.00,
    currency: 'USD',
    incoterms: 'FOB Da Nang',
    orderDate: '05 Oct 2026',
    expectedDelivery: '18 Oct 2026',
    paymentTerms: 'Net 15 Days',
    completeness: 'Đầy đủ',
    completenessCount: { current: 6, total: 6 },
    consistency: 'Khớp dữ liệu',
    approval: 'Đã phê duyệt',
    signing: 'Đã ký',
    overallStatus: 'Hoàn tất',
    checklist: [
      {
        docType: 'Purchase Order',
        required: true,
        docId: 'DOC-2401',
        docRef: 'PO-1168',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Commercial Invoice',
        required: true,
        docId: 'DOC-2402',
        docRef: 'INV-2391',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Đã ký'
      },
      {
        docType: 'Packing List',
        required: true,
        docId: 'DOC-PL-1168',
        docRef: 'PL-1168',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Bill of Lading',
        required: true,
        docId: 'DOC-2404',
        docRef: 'BL-5531',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Đã ký'
      },
      {
        docType: 'Certificate of Origin',
        required: true,
        docId: 'DOC-2403',
        docRef: 'CO-118',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Customs Declaration',
        required: true,
        docId: 'DOC-CD-1168',
        docRef: 'CD-HP-1168',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Đã kiểm tra',
        approvalStatus: 'Đã phê duyệt',
        signingStatus: 'Không yêu cầu'
      }
    ],
    shipments: [
      {
        id: 'shp-1168-1',
        orderId: 'ord-103',
        shipmentNumber: 'SHP-8819',
        origin: 'Yokohama, Japan',
        destination: 'Hai Phong, Vietnam',
        carrier: 'BlueWave Shipping Ltd.',
        vesselOrFlight: 'M/V Viking Ocean v.42B',
        containerNo: 'MSCU-1029841',
        etd: '08 Oct 2026',
        eta: '16 Oct 2026',
        status: 'Delivered',
        documentCount: 5
      }
    ],
    discrepancies: []
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-2026-004',
    title: 'Nhập khẩu tấm bán dẫn và nguyên liệu vi mạch',
    buyer: 'Atlas Components Vietnam JSC',
    seller: 'Shenzhen Apex Semiconductors',
    commodityType: 'Bán dẫn & Nguyên liệu (Silicon Wafers)',
    contractQuantity: 500,
    unit: 'wafers',
    totalValue: 31500.00,
    currency: 'USD',
    incoterms: 'DAP Dinh Vu Industrial Zone',
    orderDate: '20 Oct 2026',
    expectedDelivery: '05 Nov 2026',
    paymentTerms: 'T/T 50% advance, 50% upon delivery',
    completeness: 'Chưa đầy đủ',
    completenessCount: { current: 3, total: 6 },
    consistency: 'Chưa kiểm tra',
    approval: 'Chưa gửi',
    signing: 'Chờ ký',
    overallStatus: 'Chưa đầy đủ',
    checklist: [
      {
        docType: 'Sales Contract',
        required: true,
        docId: 'DOC-SC-004',
        docRef: 'SC-APEX-004',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Chưa kiểm tra',
        approvalStatus: 'Chưa yêu cầu',
        signingStatus: 'Chờ ký'
      },
      {
        docType: 'Purchase Order',
        required: true,
        docId: 'DOC-PO-004',
        docRef: 'PO-1199',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Chưa kiểm tra',
        approvalStatus: 'Chưa yêu cầu',
        signingStatus: 'Không yêu cầu'
      },
      {
        docType: 'Commercial Invoice',
        required: true,
        docId: 'DOC-INV-004',
        docRef: 'INV-APEX-004',
        uploadStatus: 'Đã tải lên',
        aiReviewStatus: 'Chưa kiểm tra',
        approvalStatus: 'Chưa phê duyệt',
        signingStatus: 'Chờ ký'
      },
      {
        docType: 'Packing List',
        required: true,
        uploadStatus: 'Chưa có',
        aiReviewStatus: '—',
        approvalStatus: '—',
        signingStatus: '—'
      },
      {
        docType: 'Bill of Lading',
        required: true,
        uploadStatus: 'Chưa có',
        aiReviewStatus: '—',
        approvalStatus: '—',
        signingStatus: '—'
      },
      {
        docType: 'Certificate of Origin',
        required: true,
        uploadStatus: 'Chưa có',
        aiReviewStatus: '—',
        approvalStatus: '—',
        signingStatus: '—'
      }
    ],
    shipments: [],
    discrepancies: []
  }
];
