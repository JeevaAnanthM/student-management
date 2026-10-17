import React from 'react';

export const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const iconClass =
    type === 'success'
      ? 'bi-check-circle-fill text-success'
      : type === 'warning'
      ? 'bi-exclamation-triangle-fill text-warning'
      : type === 'info'
      ? 'bi-info-circle-fill text-info'
      : 'bi-exclamation-octagon-fill text-danger';

  return (
    <div
      className={`alert alert-${type} d-flex align-items-center justify-content-between py-2 px-3 mb-3 rounded-3 shadow-sm`}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <i className={`bi ${iconClass} me-2 fs-5`}></i>
        <span className="small">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Close"
          onClick={onClose}
          style={{ fontSize: '0.75rem' }}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
