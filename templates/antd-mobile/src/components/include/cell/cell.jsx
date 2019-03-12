import React from 'react';
import s from './cell.less';

const Cell = (props) => {
  const { info } = { ...props };
  return (
    <div className={s.container}>
      <img src={info.img} alt="flags" className={s.flags} />
      <div className={s.tag}>{info.unit}</div>
      <div className={s.info}>
        <input type="number" className={s.number} placeholder={info.base} maxLength="11" />
        <div className={s.unit}>{info.text}</div>
      </div>
    </div>
  );
};

export default Cell;
