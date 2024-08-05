import React from 'react';
import { useNavigate } from 'react-router-dom';

import { IoMdArrowRoundBack } from 'react-icons/io';

const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div>
      <IoMdArrowRoundBack
        style={{ fontSize: '30px', cursor: 'pointer', marginRight: '4px' }}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default BackBtn;
