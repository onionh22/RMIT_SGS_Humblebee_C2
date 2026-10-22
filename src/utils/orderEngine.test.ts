import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOverallOrderStatus, validateOrderCrossDocuments } from './orderEngine';

test('Order Engine: Discrepancy triggers "Cần kiểm tra" overall status', () => {
  const status = calculateOverallOrderStatus('Đầy đủ', 'Cần kiểm tra', 'Chờ phê duyệt', 'Chờ ký');
  assert.equal(status, 'Cần kiểm tra');
});

test('Order Engine: Incomplete documents triggers "Chưa đầy đủ" overall status', () => {
  const status = calculateOverallOrderStatus('Chưa đầy đủ', 'Khớp dữ liệu', 'Chưa gửi', 'Không yêu cầu ký');
  assert.equal(status, 'Chưa đầy đủ');
});

test('Order Engine: Fully signed order resolves to "Hoàn tất"', () => {
  const status = calculateOverallOrderStatus('Đầy đủ', 'Khớp dữ liệu', 'Đã phê duyệt', 'Đã ký');
  assert.equal(status, 'Hoàn tất');
});

test('Order Engine: Approved but pending signature resolves to "Chờ ký"', () => {
  const status = calculateOverallOrderStatus('Đầy đủ', 'Khớp dữ liệu', 'Đã phê duyệt', 'Chờ ký');
  assert.equal(status, 'Chờ ký');
});

test('Order Engine: Cross-document validation identifies PO vs Invoice quantity mismatch on ORD-2026-001', () => {
  const issues = validateOrderCrossDocuments({ orderNumber: 'ORD-2026-001' });
  assert.ok(issues.length >= 1);
  assert.equal(issues[0].field, 'Số lượng hàng hóa (Quantity)');
  assert.equal(issues[0].severity, 'HIGH');
});
