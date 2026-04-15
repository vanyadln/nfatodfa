import { motion } from 'framer-motion';
import type { NFA, DFA } from '@/lib/nfa-to-dfa';

interface Props {
  automaton: NFA | DFA;
  title: string;
}

export default function TransitionTable({ automaton, title }: Props) {
  const alphabet = automaton.alphabet.filter(s => s !== 'ε' && s !== 'eps');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="overflow-x-auto rounded-xl glass border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">State</th>
              {alphabet.map(sym => (
                <th key={sym} className="px-4 py-3 text-left text-muted-foreground font-medium">δ(_, {sym})</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {automaton.states.map(state => (
              <tr key={state} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold">
                  <span className={`inline-flex items-center gap-1 ${state === automaton.startState ? 'text-success' : automaton.finalStates.includes(state) ? 'text-accent' : 'text-primary'}`}>
                    {state === automaton.startState && '→ '}
                    {automaton.finalStates.includes(state) && '* '}
                    {state}
                  </span>
                </td>
                {alphabet.map(sym => {
                  const target = automaton.transitions[state]?.[sym];
                  const display = Array.isArray(target) ? `{${target.join(', ')}}` : (target || '∅');
                  return (
                    <td key={sym} className="px-4 py-3 font-mono text-muted-foreground">{display}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
