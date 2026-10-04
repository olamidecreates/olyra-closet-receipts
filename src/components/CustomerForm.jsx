export default function CustomerForm({ customer, date, receiptNo, onCustomer, onDate }) {
  const set = (k) => (e) => onCustomer({ ...customer, [k]: e.target.value })
  return (
    <section className="block" aria-labelledby="h-customer">
      <h2 id="h-customer">Customer</h2>
      <label className="field"><span>Customer name</span>
        <input type="text" value={customer.name} onChange={set('name')} autoComplete="off" placeholder="Full name" />
      </label>
      <label className="field"><span>Phone number</span>
        <input type="tel" inputMode="tel" value={customer.phone} onChange={set('phone')} autoComplete="off" placeholder="0801 234 5678" />
      </label>
      <label className="field"><span>Delivery address</span>
        <textarea rows={3} value={customer.address} onChange={set('address')} placeholder="Street, area, city" />
      </label>
      <div className="row2">
        <div className="field"><span>Receipt number</span><div className="static">{receiptNo}</div></div>
        <label className="field"><span>Date</span>
          <input type="date" value={date} onChange={(e) => onDate(e.target.value)} />
        </label>
      </div>
    </section>
  )
}
