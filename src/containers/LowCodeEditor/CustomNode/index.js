import React, { memo } from 'react';

import ReactFlow, { Handle } from 'reactflow';

function CustomNode({ data }) {
  return (
    <div style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}>
      <div>{data.label}</div>
      <Handle type="source" position="center" style={{ background: 'black' }} />
      <Handle type="target" position="center" style={{ background: 'blue' }} />
    </div>
  );
}
