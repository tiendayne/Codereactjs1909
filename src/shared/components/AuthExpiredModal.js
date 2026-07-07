export default function AuthExpiredModal({ message, onConfirm }) {
  return (
    <div className="auth-expired-backdrop" role="alertdialog" aria-modal="true">
      <div className="auth-expired-dialog">
        <h2>Phien dang nhap da het han</h2>
        <p>{message || 'Vui long dang nhap lai de tiep tuc.'}</p>
        <button className="btn primary auth-expired-button" type="button" onClick={onConfirm}>
          OK
        </button>
      </div>
    </div>
  );
}
