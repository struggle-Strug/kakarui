import React from 'react';
// import { useConnection } from '@xyflow/react';
import ReactFlow, { MiniMap, Controls, Background, Handle } from 'reactflow';

export default ({ fromX, fromY, toX, toY }) => {
  const { fromHandle } = useConnection();

  return (
    <g>
      <path
        fill="none"
        stroke={fromHandle.id}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={fromHandle.id}
        strokeWidth={1.5}
      />
    </g>
  );
};
