export interface NFA {
  states: string[];
  alphabet: string[];
  transitions: Record<string, Record<string, string[]>>;
  startState: string;
  finalStates: string[];
}

export interface DFA {
  states: string[];
  alphabet: string[];
  transitions: Record<string, Record<string, string>>;
  startState: string;
  finalStates: string[];
}

export interface ConversionStep {
  type: 'epsilon-closure' | 'subset-construction' | 'new-state' | 'transition' | 'final';
  description: string;
  detail: string;
  highlightStates?: string[];
}

function epsilonClosure(nfa: NFA, states: Set<string>): Set<string> {
  const closure = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const state = stack.pop()!;
    const epsTransitions = nfa.transitions[state]?.['ε'] || nfa.transitions[state]?.['eps'] || [];
    for (const next of epsTransitions) {
      if (!closure.has(next)) {
        closure.add(next);
        stack.push(next);
      }
    }
  }
  return closure;
}

function move(nfa: NFA, states: Set<string>, symbol: string): Set<string> {
  const result = new Set<string>();
  for (const state of states) {
    const targets = nfa.transitions[state]?.[symbol] || [];
    for (const t of targets) result.add(t);
  }
  return result;
}

function stateSetToString(states: Set<string>): string {
  const sorted = [...states].sort();
  return sorted.length === 0 ? '∅' : `{${sorted.join(',')}}`;
}

export function convertNFAtoDFA(nfa: NFA): { dfa: DFA; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const alphabet = nfa.alphabet.filter(s => s !== 'ε' && s !== 'eps');

  // Step 1: ε-closure of start state
  const startClosure = epsilonClosure(nfa, new Set([nfa.startState]));
  const startKey = stateSetToString(startClosure);
  steps.push({
    type: 'epsilon-closure',
    description: `ε-closure of start state {${nfa.startState}}`,
    detail: `ε-closure({${nfa.startState}}) = ${startKey}`,
    highlightStates: [...startClosure],
  });

  const dfaTransitions: Record<string, Record<string, string>> = {};
  const dfaStates: Map<string, Set<string>> = new Map();
  const unmarked: { key: string; states: Set<string> }[] = [];

  dfaStates.set(startKey, startClosure);
  unmarked.push({ key: startKey, states: startClosure });
  dfaTransitions[startKey] = {};

  steps.push({
    type: 'new-state',
    description: `DFA start state created`,
    detail: `New DFA state: ${startKey}`,
    highlightStates: [...startClosure],
  });

  while (unmarked.length > 0) {
    const current = unmarked.shift()!;

    steps.push({
      type: 'subset-construction',
      description: `Processing DFA state ${current.key}`,
      detail: `Computing transitions for ${current.key} on each symbol`,
      highlightStates: [...current.states],
    });

    for (const symbol of alphabet) {
      const moved = move(nfa, current.states, symbol);
      const closed = epsilonClosure(nfa, moved);
      const key = stateSetToString(closed);

      steps.push({
        type: 'transition',
        description: `δ(${current.key}, ${symbol})`,
        detail: `move(${current.key}, ${symbol}) = ${stateSetToString(moved)} → ε-closure = ${key}`,
        highlightStates: [...closed],
      });

      dfaTransitions[current.key][symbol] = key;

      if (key !== '∅' && !dfaStates.has(key)) {
        dfaStates.set(key, closed);
        dfaTransitions[key] = {};
        unmarked.push({ key, states: closed });
        steps.push({
          type: 'new-state',
          description: `New DFA state discovered`,
          detail: `New DFA state: ${key}`,
          highlightStates: [...closed],
        });
      }
    }
  }

  // Handle ∅ state
  if (Object.values(dfaTransitions).some(t => Object.values(t).includes('∅'))) {
    if (!dfaStates.has('∅')) {
      dfaStates.set('∅', new Set());
      dfaTransitions['∅'] = {};
      for (const symbol of alphabet) {
        dfaTransitions['∅'][symbol] = '∅';
      }
    }
  }

  const dfaFinalStates = [...dfaStates.entries()]
    .filter(([, nfaStates]) => [...nfaStates].some(s => nfa.finalStates.includes(s)))
    .map(([key]) => key);

  steps.push({
    type: 'final',
    description: 'Conversion complete',
    detail: `DFA has ${dfaStates.size} states. Final states: ${dfaFinalStates.join(', ') || 'none'}`,
    highlightStates: [],
  });

  return {
    dfa: {
      states: [...dfaStates.keys()],
      alphabet,
      transitions: dfaTransitions,
      startState: startKey,
      finalStates: dfaFinalStates,
    },
    steps,
  };
}

export const SAMPLE_NFA: NFA = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['a', 'b', 'ε'],
  transitions: {
    q0: { a: ['q0', 'q1'], b: ['q0'], 'ε': [] },
    q1: { a: [], b: ['q2'], 'ε': [] },
    q2: { a: [], b: [], 'ε': [] },
  },
  startState: 'q0',
  finalStates: ['q2'],
};
