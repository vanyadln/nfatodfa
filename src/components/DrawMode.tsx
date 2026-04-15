import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Plus, Play, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { NFA } from '@/lib/nfa-to-dfa';
import { SAMPLE_NFA } from '@/lib/nfa-to-dfa';
import StateNode from './StateNode';

const nodeTypes = { stateNode: StateNode };

interface Props {
  onSubmit: (nfa: NFA) => void;
  onReset: () => void;
}

export default function DrawMode({ onSubmit, onReset }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [edgeLabel, setEdgeLabel] = useState('a');
  const stateCounter = useRef(0);

  const addState = () => {
    const id = `q${stateCounter.current++}`;
    const newNode: Node = {
      id,
      type: 'stateNode',
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: id, isStart: false, isFinal: false },
    };
    setNodes(nds => [...nds, newNode]);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        ...params,
        id: `e-${params.source}-${params.target}-${edgeLabel}-${Date.now()}`,
        label: edgeLabel,
        type: 'default',
        animated: true,
        style: { stroke: 'hsl(217 91% 60%)' },
        labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600, fontSize: 14 },
        labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 6,
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(217 91% 60%)' },
      } as Edge;
      setEdges(eds => addEdge(edge, eds));
    },
    [edgeLabel, setEdges]
  );

  const toggleStart = (nodeId: string) => {
    setNodes(nds =>
      nds.map(n => ({
        ...n,
        data: { ...n.data, isStart: n.id === nodeId ? !n.data.isStart : false },
      }))
    );
  };

  const toggleFinal = (nodeId: string) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, isFinal: !n.data.isFinal } } : n
      )
    );
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    // Show context options via data attributes
    const action = window.prompt(`Node ${node.id}:\nType "s" to toggle Start, "f" to toggle Final, "d" to delete`);
    if (action === 's') toggleStart(node.id);
    else if (action === 'f') toggleFinal(node.id);
    else if (action === 'd') {
      setNodes(nds => nds.filter(n => n.id !== node.id));
      setEdges(eds => eds.filter(e => e.source !== node.id && e.target !== node.id));
    }
  };

  const buildNFA = (): NFA => {
    const states = nodes.map(n => n.id);
    const alphabetSet = new Set<string>();
    const transitions: Record<string, Record<string, string[]>> = {};

    states.forEach(s => { transitions[s] = {}; });

    edges.forEach(e => {
      const label = (e.label as string) || 'a';
      alphabetSet.add(label);
      if (!transitions[e.source][label]) transitions[e.source][label] = [];
      transitions[e.source][label].push(e.target);
    });

    const startNode = nodes.find(n => n.data.isStart);
    const finalNodes = nodes.filter(n => n.data.isFinal);

    return {
      states,
      alphabet: [...alphabetSet],
      transitions,
      startState: startNode?.id || states[0] || '',
      finalStates: finalNodes.map(n => n.id),
    };
  };

  const handleConvert = () => {
    if (nodes.length === 0) { alert('Add some states first!'); return; }
    onSubmit(buildNFA());
  };

  const loadSample = () => {
    stateCounter.current = 3;
    const sampleNodes: Node[] = [
      { id: 'q0', type: 'stateNode', position: { x: 50, y: 150 }, data: { label: 'q0', isStart: true, isFinal: false } },
      { id: 'q1', type: 'stateNode', position: { x: 300, y: 50 }, data: { label: 'q1', isStart: false, isFinal: false } },
      { id: 'q2', type: 'stateNode', position: { x: 550, y: 150 }, data: { label: 'q2', isStart: false, isFinal: true } },
    ];
    const sampleEdges: Edge[] = [
      { id: 'e1', source: 'q0', target: 'q0', label: 'a', animated: true, style: { stroke: 'hsl(217 91% 60%)' }, labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600 }, labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 }, labelBgPadding: [6, 4] as [number, number], labelBgBorderRadius: 6, markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(217 91% 60%)' } },
      { id: 'e2', source: 'q0', target: 'q1', label: 'a', animated: true, style: { stroke: 'hsl(217 91% 60%)' }, labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600 }, labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 }, labelBgPadding: [6, 4] as [number, number], labelBgBorderRadius: 6, markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(217 91% 60%)' } },
      { id: 'e3', source: 'q0', target: 'q0', label: 'b', animated: true, style: { stroke: 'hsl(280 70% 60%)' }, labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600 }, labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 }, labelBgPadding: [6, 4] as [number, number], labelBgBorderRadius: 6, markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(280 70% 60%)' } },
      { id: 'e4', source: 'q1', target: 'q2', label: 'b', animated: true, style: { stroke: 'hsl(280 70% 60%)' }, labelStyle: { fill: 'hsl(210 40% 95%)', fontWeight: 600 }, labelBgStyle: { fill: 'hsl(225 20% 10%)', fillOpacity: 0.9 }, labelBgPadding: [6, 4] as [number, number], labelBgBorderRadius: 6, markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(280 70% 60%)' } },
    ];
    setNodes(sampleNodes);
    setEdges(sampleEdges);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    stateCounter.current = 0;
    onReset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <Button onClick={addState} variant="secondary" className="gap-2">
          <Plus className="w-4 h-4" /> Add State
        </Button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Edge Label:</label>
          <Input value={edgeLabel} onChange={e => setEdgeLabel(e.target.value)} className="w-20 glass border-border/50" />
        </div>
        <Button onClick={handleConvert} className="btn-gradient glow-primary gap-2">
          <Play className="w-4 h-4" /> Convert
        </Button>
        <Button onClick={loadSample} variant="secondary" className="gap-2">
          <Sparkles className="w-4 h-4" /> Sample
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <Trash2 className="w-4 h-4" /> Clear
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Click a node and type "s" for start, "f" for final, "d" to delete. Drag between nodes to connect.</p>
      <div className="h-[400px] rounded-xl glass overflow-hidden border border-border/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(225 15% 20%)" />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
