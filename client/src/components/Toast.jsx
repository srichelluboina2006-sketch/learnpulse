import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const config = {
    success: {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      color: '#065f46',
      icon: CheckCircle2,
      iconColor: '#10b981'
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#991b1b',
      icon: XCircle,
      iconColor: '#ef4444'
    },
    warning: {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#92400e',
      icon: AlertTriangle,
      iconColor: '#f59e0b'
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      color: '#1e40af',
      icon: Info,
      iconColor: '#3b82f6'
    }
  }[type] || config.info;

  const Icon = config.icon;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '12px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        zIndex: 9999,
        maxWidth: '420px',
        animation: 'slideUp 0.25s ease-out'
      }}
    >
      <Icon size={20} color={config.iconColor} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: config.color, flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: config.color }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
