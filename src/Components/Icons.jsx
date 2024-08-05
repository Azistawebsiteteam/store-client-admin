import React from 'react';

import { RxCrossCircled } from 'react-icons/rx';
import { CiSquarePlus } from 'react-icons/ci';

export const AddIcon = ({ onClick }) => {
  return (
    <CiSquarePlus
      style={{
        fontSize: '40px',
        cursor: 'pointer',
        margin: '10px',
        alignSelf: 'flex-end',
      }}
      onClick={onClick}
    />
  );
};

export const RemoveIcon = ({ onClick }) => {
  return (
    <RxCrossCircled
      style={{
        fontSize: '25px',
        cursor: 'pointer',
        margin: '10px',
        alignSelf: 'flex-end',
      }}
      onClick={onClick}
    />
  );
};
