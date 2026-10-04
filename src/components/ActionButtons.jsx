export default function ActionButtons({ onDownload, onNew, busy, armed, error, canDownload }) {
  return (
    <section className="actions" aria-label="Actions">
      <button type="button" className="btn-primary" onClick={onDownload} disabled={busy || !canDownload}>
        {busy ? 'Preparing image…' : 'DOWNLOAD IMAGE'}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" className="btn-outline" onClick={onNew}>
        {armed ? 'Tap again to clear this receipt' : 'NEW RECEIPT'}
      </button>
    </section>
  )
}
