import React from 'react';
import { Button } from 'antd';

const index = () => {
  return (
    <div>
      <p className='underline'>The Line Updated!</p>
       <Button type="primary" className="bg-blue-500 hover:bg-blue-700 text-white font-bold pb-2 px-4 rounded">
        Click Me
      </Button>
    </div>
  );
};

export default index;
