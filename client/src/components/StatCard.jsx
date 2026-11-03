import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, bgGradient, iconColor, borderColor }) => {
  return (
    <div
      className="stat-card"
      style={{
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined
      }}
    >
      <div
        className="stat-icon-wrapper"
        style={{
          background: bgGradient || 'linear-gradient(135deg, #ede9fe 0%, #eff6ff 100%)',
          color: iconColor || '#4f46e5'
        }}
      >
        <Icon size={26} />
      </div>

      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;
