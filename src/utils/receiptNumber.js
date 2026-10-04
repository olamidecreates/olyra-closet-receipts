const KEY = 'olyra.receiptCounter'
export const formatReceiptNo = (n) => 'OLY-' + String(n).padStart(4, '0')
export const loadCounter = () => {
  try { return Math.max(1, parseInt(localStorage.getItem(KEY), 10) || 1) } catch { return 1 }
}
export const saveCounter = (n) => { try { localStorage.setItem(KEY, String(n)) } catch {} }
