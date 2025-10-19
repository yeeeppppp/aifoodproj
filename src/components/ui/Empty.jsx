import React from 'react';
import CheckIcon from '../../shared/icons/CheckIcon';
import './Empty.css';

export default function Empty({ title = 'Пусто', description = 'Здесь пока ничего нет', action }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty__icon"><CheckIcon size={28} color="var(--color-text-muted)"/></div>
      <div className="ui-empty__title">{title}</div>
      <div className="ui-empty__desc">{description}</div>
      {action && <div className="ui-empty__action">{action}</div>}
    </div>
  );
}









