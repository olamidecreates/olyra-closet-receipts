import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import Header from './components/Header'
import CustomerForm from './components/CustomerForm'
import ProductEditor from './components/ProductEditor'
import ReceiptPreview from './components/ReceiptPreview'
import ActionButtons from './components/ActionButtons'
import { formatReceiptNo, loadCounter, saveCounter } from './utils/receiptNumber'
import { todayISO } from './utils/date'

const DRAFT = 'olyra.draft'
const blank = () => ({ customer: { name: '', phone: '', address: '' }, date: todayISO(), delivery: '0', items: [] })
const loadDraft = () => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT))
    if (d && d.customer && Array.isArray(d.items)) return { ...blank(), ...d }
  } catch {}
  return blank()
}

export default function App() {
  const [counter, setCounter] = useState(loadCounter)
  const [draft, setDraft] = useState(loadDraft)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [armed, setArmed] = useState(false)
  const exportRef = useRef(null)
  const receiptNo = formatReceiptNo(counter)
  const { customer, date, delivery, items } = draft
  const patch = (p) => setDraft((d) => ({ ...d, ...p }))

  useEffect(() => { try { localStorage.setItem(DRAFT, JSON.stringify(draft)) } catch {} }, [draft])
  useEffect(() => { saveCounter(counter) }, [counter])
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3500); return () => clearTimeout(t) }, [armed])

  const dirty = items.length > 0 || customer.name || customer.phone || customer.address || delivery !== '0'

  const onNew = () => {
    if (dirty && !armed) return setArmed(true)
    setArmed(false); setError('')
    setCounter((c) => c + 1)
    setDraft(blank())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDownload = async () => {
    const node = exportRef.current
    if (!node) return
    setBusy(true); setError('')
    try {
      await document.fonts.ready
      const opts = { pixelRatio: 2, backgroundColor: '#FBF8F2', cacheBust: true, width: node.offsetWidth, height: node.offsetHeight }
      await toPng(node, opts) // warm-up pass so fonts/styles are embedded on first real export
      const url = await toPng(node, opts)
      const a = document.createElement('a')
      a.download = `OLYRA-Receipt-${receiptNo}.png`
      a.href = url
      document.body.appendChild(a); a.click(); a.remove()
    } catch (e) {
      setError('The image could not be created. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="app">
      <Header />
      <main className="layout">
        <div className="form-col">
          <CustomerForm customer={customer} date={date} receiptNo={receiptNo} onCustomer={(c) => patch({ customer: c })} onDate={(d) => patch({ date: d })} />
          <ProductEditor items={items} delivery={delivery} onItems={(i) => patch({ items: i })} onDelivery={(v) => patch({ delivery: v })} />
        </div>
        <div className="preview-col">
          <ReceiptPreview exportRef={exportRef} receiptNo={receiptNo} date={date} customer={customer} items={items} delivery={delivery} />
        </div>
        <ActionButtons onDownload={onDownload} onNew={onNew} busy={busy} armed={armed} error={error} canDownload={items.length > 0} />
      </main>
    </div>
  )
}
