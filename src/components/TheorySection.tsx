import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    title: 'What is an NFA?',
    content: `A Non-deterministic Finite Automaton (NFA) is a finite state machine where for each state and input symbol, there can be multiple possible next states. NFAs can also have ε-transitions (epsilon transitions) that allow state changes without consuming any input symbol. Formally, an NFA is defined as a 5-tuple (Q, Σ, δ, q₀, F) where Q is the set of states, Σ is the input alphabet, δ is the transition function (Q × (Σ ∪ {ε}) → P(Q)), q₀ is the start state, and F is the set of final/accepting states.`,
  },
  {
    title: 'What is a DFA?',
    content: `A Deterministic Finite Automaton (DFA) is a finite state machine where for each state and input symbol, there is exactly one next state. Unlike NFAs, DFAs have no ε-transitions and no ambiguity in transitions. A DFA is defined as a 5-tuple (Q, Σ, δ, q₀, F) where the transition function δ maps Q × Σ → Q (exactly one state for each state-symbol pair).`,
  },
  {
    title: 'Why Convert NFA to DFA?',
    content: `While NFAs are often easier to design and more intuitive for representing certain languages, DFAs are simpler to implement in hardware and software. Every NFA has an equivalent DFA that accepts the same language. The conversion is essential because: (1) DFAs are faster to simulate — O(1) per input symbol vs potentially exponential for NFAs, (2) DFAs are required for many practical applications like lexical analyzers, (3) DFA minimization algorithms can produce optimal recognizers.`,
  },
  {
    title: 'Subset Construction Algorithm',
    content: `The subset construction (also called powerset construction) converts an NFA to an equivalent DFA. Each DFA state corresponds to a set of NFA states. The algorithm: (1) Start with ε-closure of the NFA start state as the DFA start state. (2) For each unmarked DFA state T and input symbol a, compute U = ε-closure(move(T, a)). (3) If U is a new state, add it as unmarked. (4) Mark T and repeat until all states are marked. (5) A DFA state is accepting if it contains any NFA accepting state. The worst case produces 2ⁿ DFA states for n NFA states, though in practice far fewer are reachable.`,
  },
  {
    title: 'ε-Closure Explained',
    content: `The ε-closure of a state q is the set of all states reachable from q by following only ε-transitions (including q itself). For a set of states T, ε-closure(T) = ∪{ε-closure(q) | q ∈ T}. Computing ε-closure uses a simple DFS or BFS: start with the given state(s), follow all ε-transitions, and collect every reachable state. This operation is fundamental to the subset construction as it determines the actual set of NFA states that correspond to each DFA state.`,
  },
];

export default function TheorySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Theory of NFA to DFA Conversion</h2>
      </div>
      <div className="space-y-2">
        {sections.map((section, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden border border-border/50">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
            >
              <span className="font-semibold text-foreground">{section.title}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
