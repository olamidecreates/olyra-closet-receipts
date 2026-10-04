import { PRODUCTS } from '../data/products'
import { digits, naira } from '../utils/currency'

function ItemRow({ item, index, onChange, onRemove }) {
  const set = (patch) => onChange({ ...item, ...patch })
  return (
    <li className="item">
      <div className="item-top">
        <label className="field grow"><span>Product {index + 1}</span>
          <input type="text" value={item.name} onChange={(e) => set({ name: e.target.value })} placeholder="Product name" />
        </label>
        <button type="button" className="btn-text" onClick={onRemove} aria-label={`Remove ${item.name || 'item ' + (index + 1)}`}>Remove</button>
      </div>
      {item.prices && item.prices.length > 1 && (
        <div className="chips" role="group" aria-label="Price presets">
          {item.prices.map((p) => (
            <button type="button" key={p} className={'chip' + (Number(item.price) === p ? ' on' : '')} onClick={() => set({ price: String(p) })}>{naira(p)}</button>
          ))}
        </div>
      )}
      <div className="row2">
        <div className="field"><span>Quantity</span>
          <div className="stepper">
            <button type="button" aria-label="Decrease quantity" onClick={() => set({ qty: Math.max(1, item.qty - 1) })} disabled={item.qty <= 1}>−</button>
            <output aria-live="polite">{item.qty}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => set({ qty: item.qty + 1 })}>+</button>
          </div>
        </div>
        <label className="field"><span>Unit price (₦)</span>
          <input type="text" inputMode="numeric" value={item.price} onChange={(e) => set({ price: digits(e.target.value) })} placeholder="0" />
        </label>
      </div>
    </li>
  )
}

export default function ProductEditor({ items, delivery, onItems, onDelivery }) {
  const add = (p) => onItems([...items, { id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()), name: p?.name ?? '', qty: 1, price: p ? String(p.prices[0]) : '', prices: p?.prices }])
  const update = (id, next) => onItems(items.map((i) => (i.id === id ? next : i)))
  return (
    <section className="block" aria-labelledby="h-order">
      <h2 id="h-order">Order</h2>
      <ul className="items">
        {items.map((it, i) => (
          <ItemRow key={it.id} item={it} index={i} onChange={(n) => update(it.id, n)} onRemove={() => onItems(items.filter((x) => x.id !== it.id))} />
        ))}
      </ul>
      <div className="add-row">
        <label className="field grow"><span>Add from Olyra products</span>
          <select value="" onChange={(e) => { const p = PRODUCTS.find((x) => x.name === e.target.value); if (p) add(p) }}>
            <option value="">Choose a product</option>
            {PRODUCTS.map((p) => <option key={p.name} value={p.name}>{p.name} · {p.prices.length > 1 ? `${naira(p.prices[0])}–${naira(p.prices[p.prices.length - 1])}` : naira(p.prices[0])}</option>)}
          </select>
        </label>
        <button type="button" className="btn-outline" onClick={() => add(null)}>Add custom item</button>
      </div>
      <label className="field"><span>Delivery fee (₦)</span>
        <input type="text" inputMode="numeric" value={delivery} onChange={(e) => onDelivery(digits(e.target.value))} placeholder="0" />
      </label>
    </section>
  )
}
