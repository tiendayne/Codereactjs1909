export default function TextField({ name, type="text", value, onChange, placeholder, error }) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      <div className="input-wrap">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
