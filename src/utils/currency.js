export const digits = (v) => String(v ?? '').replace(/\D/g, '')
export const toNum = (v) => parseInt(digits(v), 10) || 0
export const naira = (n) => '₦' + Math.max(0, Math.round(Number(n) || 0)).toLocaleString('en-US')
