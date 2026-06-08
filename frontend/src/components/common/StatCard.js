import React from 'react';
import { Card } from 'react-bootstrap';
import './StatCard.css';

const StatCard = ({ title, value, icon, color = 'success', subtitle }) => (
  <Card className="h-100 border-0 shadow-sm stat-card">
    <Card.Body className="d-flex align-items-center stat-card-body">
      <div className={`rounded-circle bg-${color} bg-opacity-10 p-3 me-3 stat-card-icon`}>
        <span className={`text-${color} fs-4`}>{icon}</span>
      </div>
      <div>
        <div className="small stat-card-title">{title}</div>
        <div className="fw-bold fs-5 stat-card-value">{value}</div>
        {subtitle && <div className="small stat-card-subtitle">{subtitle}</div>}
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;
