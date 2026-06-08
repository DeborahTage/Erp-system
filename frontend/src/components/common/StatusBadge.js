import React from 'react';
import { Badge } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { statusBadge } from '../../utils';

const StatusBadge = ({ status }) => {
  const { t } = useLanguage();

  return <Badge bg={statusBadge(status)}>{t(`status.${status}`)}</Badge>;
};

export default StatusBadge;
