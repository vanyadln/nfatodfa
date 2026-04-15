import { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StateNode from './StateNode';
import type { NFA, DFA } from '@/lib/nfa-to-dfa';

const nodeTypes = { stateNode: StateNode };

interface Props {
  automaton: NFA | DFA;
  title: string;
  isDFA?: boolean;
}

export default function GraphView({ automaton, title, isDFA }: Props) {
  const { nodes, edges } = useMemo(() => {
    const stateCount = automaton.states.length;
    const radius = Math.max(150, stateCount * 40);
    const centerX = 300;
    const centerY = 200;

    const nodes: Node[] = automaton.states.map((state, i) => {
      const angle = (2 * Math.PI * i) / stateCount - Math.PI / 2;
      return {
        id: state,
        type: 'stateNode',
        position: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
        data: {
          label: state.length > 10 ? state.slice(0, 10) + '…' : state,
          isStart: state === automaton.startState,
          isFinal: automaton.finalStates.includes(state),
        },
      };
    });

    const edges: Edge[] = [];
    const trans = automaton.transitions;
    Object.entries(trans).forEach(([from, symbols]) => {
      Object.entries(symbols).forEach(([symbol, targets]) => {
        const targetList = Array.isArray(targets) ? targets : [targets];
        targetList.forEach(to => {
          if (to === '∅') return;
          edges.push({
            id: `${from}-${to}-${symbol}-${Math.random()}`,
            source: from,
            target: to,
            label: symbol,
            animated: !isDFA,
            style: { stroke: isDFA ? 'hsl(280 70% 60%)' : 'hsl(217 91% 60%)' },
            labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 },
            labelBgPadding: [6, 4] as [number, number],
            labelBgBorderRadius: 6,
            markerEnd: { type: MarkerType.ArrowClosed, color: isDFA ? 'hsl(280 70% 60%)' : 'hsl(217 91% 60%)' },
          });
        });
      });
    });

    return { nodes, edges };
  }, [automaton, isDFA]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="h-[350px] rounded-xl glass overflow-hidden border border-border/50">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView nodesDraggable>
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(225 15% 20%)" />
        </ReactFlow>
      </div>
    </div>
  );
}
