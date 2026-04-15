import { Handle, Position, type NodeProps } from '@xyflow/react';
import { memo } from 'react';

interface StateData {
  label: string;
  isStart: boolean;
  isFinal: boolean;
  [key: string]: unknown;
}

function StateNode({ data }: NodeProps) {
  const { label, isStart, isFinal } = data as StateData;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer
          ${isStart ? 'bg-success/20 border-2 border-success node-start text-success' : ''}
          ${isFinal ? 'bg-accent/20 border-[3px] border-accent node-final text-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-background' : ''}
          ${!isStart && !isFinal ? 'bg-primary/20 border-2 border-primary/60 text-primary' : ''}
        `}
      >
        {label}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
      {isStart && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-success font-semibold">START</span>
      )}
      {isFinal && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-accent font-semibold">FINAL</span>
      )}
    </div>
  );
}

export default memo(StateNode);
