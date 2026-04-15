import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { NFA } from '@/lib/nfa-to-dfa';
import { SAMPLE_NFA } from '@/lib/nfa-to-dfa';

interface Props {
  onSubmit: (nfa: NFA) => void;
  onReset: () => void;
}

export default function ManualInput({ onSubmit, onReset }: Props) {
  const [states, setStates] = useState('');
  const [alphabet, setAlphabet] = useState('');
  const [startState, setStartState] = useState('');
  const [finalStates, setFinalStates] = useState('');
  const [transitions, setTransitions] = useState('');

  const loadSample = () => {
    setStates(SAMPLE_NFA.states.join(', '));
    setAlphabet(SAMPLE_NFA.alphabet.join(', '));
    setStartState(SAMPLE_NFA.startState);
    setFinalStates(SAMPLE_NFA.finalStates.join(', '));
    setTransitions(JSON.stringify(SAMPLE_NFA.transitions, null, 2));
  };

  const handleSubmit = () => {
    try {
      const nfa: NFA = {
        states: states.split(',').map(s => s.trim()).filter(Boolean),
        alphabet: alphabet.split(',').map(s => s.trim()).filter(Boolean),
        startState: startState.trim(),
        finalStates: finalStates.split(',').map(s => s.trim()).filter(Boolean),
        transitions: JSON.parse(transitions),
      };
      onSubmit(nfa);
    } catch {
      alert('Invalid input. Please check your transitions JSON.');
    }
  };

  const handleReset = () => {
    setStates(''); setAlphabet(''); setStartState(''); setFinalStates(''); setTransitions('');
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">States (comma separated)</label>
          <Input value={states} onChange={e => setStates(e.target.value)} placeholder="q0, q1, q2" className="glass border-border/50 focus:glow-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Alphabet (comma separated, use ε for epsilon)</label>
          <Input value={alphabet} onChange={e => setAlphabet(e.target.value)} placeholder="a, b, ε" className="glass border-border/50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Start State</label>
          <Input value={startState} onChange={e => setStartState(e.target.value)} placeholder="q0" className="glass border-border/50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Final States (comma separated)</label>
          <Input value={finalStates} onChange={e => setFinalStates(e.target.value)} placeholder="q2" className="glass border-border/50" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Transitions (JSON)</label>
        <Textarea
          value={transitions}
          onChange={e => setTransitions(e.target.value)}
          placeholder='{"q0": {"a": ["q0","q1"], "b": ["q0"]}}'
          rows={6}
          className="glass border-border/50 font-mono text-sm"
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleSubmit} className="btn-gradient glow-primary gap-2">
          <Play className="w-4 h-4" /> Convert to DFA
        </Button>
        <Button onClick={loadSample} variant="secondary" className="gap-2">
          <Sparkles className="w-4 h-4" /> Sample Input
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </motion.div>
  );
}
