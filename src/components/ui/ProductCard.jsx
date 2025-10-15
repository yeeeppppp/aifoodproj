import React from 'react';
import './ProductCard.css';
import Button from './Button';
import Badge from './Badge';

export default function ProductCard({ product, onAdd }) {
  if (!product) return null;
  const { name, price, image_url, image, badges = [], weight } = product;

  return (
    <div className="ui-product-card">
      <div className="ui-product-card__media">
        <img src={image_url || image} alt={name} loading="lazy" decoding="async" />
        <div className="ui-product-card__badges">
          {badges.map((b, i) => (
            <Badge key={i} color={b.color || 'brand'}>{b.label}</Badge>
          ))}
        </div>
      </div>
      <div className="ui-product-card__info">
        <div className="ui-product-card__name" title={name}>{name}</div>
        {weight ? <div className="ui-product-card__weight">{weight}</div> : null}
        <div className="ui-product-card__price">{price}₽</div>
      </div>
      <Button className="ui-product-card__btn" variant="primary" size="md" onClick={() => onAdd && onAdd(product)}>В корзину</Button>
    </div>
  );
}



