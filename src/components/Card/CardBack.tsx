import React from 'react';
import './CardBack.css';

interface CardBackProps {
  size?: 'normal' | 'small';
}

export const CardBack: React.FC<CardBackProps> = ({ size = 'normal' }) => {
  return <div className={`card-back card-back--${size}`} />;
};

export default CardBack;
