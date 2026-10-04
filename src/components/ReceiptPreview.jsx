import { forwardRef, useEffect, useRef, useState } from 'react'
import { naira, toNum } from '../utils/currency'
import { prettyDate } from '../utils/date'
import logo from '../assets/olyra-logo.png?inline'

export const RECEIPT_WIDTH = 1080

const Receipt = forwardRef(function Receipt({ receiptNo, date, customer, items, delivery }, ref) {
  const rows = items.map((i) => ({ ...i, line: Math.max(1, i.qty) * toNum(i.price) }))
  const subtotal = rows.reduce((s, r) => s + r.line, 0)
  const fee = toNum(delivery)
  const total = subtotal + fee
  return (
    <div className="receipt" ref={ref} style={{ width: RECEIPT_WIDTH }}>
      <div className="r-brand">
        <img src={logo} alt="Olyra Closet" className="r-logo" />
      </div>
      <div className="r-meta">
        <div><div className="r-k">Receipt</div><div className="r-v">{receiptNo}</div></div>
        <div className="r-right"><div className="r-k">Date</div><div className="r-v">{prettyDate(date) || '—'}</div></div>
      </div>
      <div className="r-rule" />
      <div className="r-sec">
        <div className="r-k">Customer</div>
        <div className="r-name">{customer.name.trim() || '—'}</div>
        {customer.phone.trim() && <div className="r-line">{customer.phone}</div>}
        {customer.address.trim() && <div className="r-line r-addr">{customer.address}</div>}
      </div>
      <div className="r-rule" />
      <div className="r-sec">
        <div className="r-k">Order</div>
        {rows.length === 0 ? (
          <p className="r-empty">Add your first item to create this receipt.</p>
        ) : (
          <>
            <div className="r-th"><span>Product</span><span>Qty</span><span>Price</span></div>
            {rows.map((r) => (
              <div className="r-tr" key={r.id}>
                <span className="r-pname">{r.name.trim() || 'Item'}</span>
                <span className="r-num">{r.qty}</span>
                <span className="r-num">{naira(r.line)}</span>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="r-rule" />
      <div className="r-sums">
        <div><span>Subtotal</span><span>{naira(subtotal)}</span></div>
        <div><span>Delivery</span><span>{fee === 0 ? 'Free' : naira(fee)}</span></div>
        <div className="r-total"><span>Total</span><span>{naira(total)}</span></div>
      </div>
      <p className="r-thanks">Thank you for shopping with Olyra Closet.</p>
    </div>
  )
})

export default function ReceiptPreview({ exportRef, ...props }) {
  const wrap = useRef(null)
  const inner = useRef(null)
  const [scale, setScale] = useState(0.3)
  const [h, setH] = useState(0)
  useEffect(() => {
    const measure = () => {
      if (wrap.current) setScale(Math.min(1, wrap.current.clientWidth / RECEIPT_WIDTH))
      if (inner.current) setH(inner.current.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    wrap.current && ro.observe(wrap.current)
    inner.current && ro.observe(inner.current)
    return () => ro.disconnect()
  }, [])
  const setRefs = (node) => { inner.current = node; exportRef.current = node }
  return (
    <div className="preview-frame" ref={wrap} aria-label="Receipt preview">
      <div style={{ height: h * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: RECEIPT_WIDTH }}>
          <Receipt ref={setRefs} {...props} />
        </div>
      </div>
    </div>
  )
}
