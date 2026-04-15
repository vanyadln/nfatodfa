import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, PenTool, Table, GitBranch } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import ManualInput from '@/components/ManualInput';
import DrawMode from '@/components/DrawMode';
import GraphView from '@/components/GraphView';
import TransitionTable from '@/components/TransitionTable';
import StepByStep from '@/components/StepByStep';
import TheorySection from '@/components/TheorySection';
import type { NFA, DFA, ConversionStep } from '@/lib/nfa-to-dfa';
import { convertNFAtoDFA } from '@/lib/nfa-to-dfa';

export default function Index() {
  const [nfa, setNfa] = useState<NFA | null>(null);
  const [dfa, setDfa] = useState<DFA | null>(null);
  const [steps, setSteps] = useState<ConversionStep[]>([]);
  const [outputView, setOutputView] = useState<'graph' | 'table'>('graph');

  const handleConvert = (inputNfa: NFA) => {
    setNfa(inputNfa);
    const result = convertNFAtoDFA(inputNfa);
    setDfa(result.dfa);
    setSteps(result.steps);
  };

  const handleReset = () => {
    setNfa(null);
    setDfa(null);
    setSteps([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <Header />

        {/* Input Modes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Tabs defaultValue="manual" className="space-y-4">
            <TabsList className="glass-strong p-1">
              <TabsTrigger value="manual" className="gap-2 data-[state=active]:btn-gradient data-[state=active]:shadow-md">
                <Layers className="w-4 h-4" /> Manual Input
              </TabsTrigger>
              <TabsTrigger value="draw" className="gap-2 data-[state=active]:btn-gradient data-[state=active]:shadow-md">
                <PenTool className="w-4 h-4" /> Draw Mode
              </TabsTrigger>
            </TabsList>
            <div className="glass-strong rounded-xl p-6">
              <TabsContent value="manual" className="mt-0">
                <ManualInput onSubmit={handleConvert} onReset={handleReset} />
              </TabsContent>
              <TabsContent value="draw" className="mt-0">
                <DrawMode onSubmit={handleConvert} onReset={handleReset} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.section>

        {/* Results */}
        {dfa && nfa && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mb-10"
          >
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOutputView('graph')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${outputView === 'graph' ? 'btn-gradient glow-primary' : 'glass text-muted-foreground hover:text-foreground'}`}
              >
                <GitBranch className="w-4 h-4" /> Graph View
              </button>
              <button
                onClick={() => setOutputView('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${outputView === 'table' ? 'btn-gradient glow-accent' : 'glass text-muted-foreground hover:text-foreground'}`}
              >
                <Table className="w-4 h-4" /> Table View
              </button>
            </div>

            {outputView === 'graph' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-strong rounded-xl p-5">
                  <GraphView automaton={nfa} title="NFA Graph" />
                </div>
                <div className="glass-strong rounded-xl p-5">
                  <GraphView automaton={dfa} title="DFA Graph" isDFA />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-strong rounded-xl p-5">
                  <TransitionTable automaton={nfa} title="NFA Transition Table" />
                </div>
                <div className="glass-strong rounded-xl p-5">
                  <TransitionTable automaton={dfa} title="DFA Transition Table" />
                </div>
              </div>
            )}

            {/* Step by Step */}
            <div className="glass-strong rounded-xl p-6">
              <StepByStep steps={steps} />
            </div>
          </motion.section>
        )}

        {/* Theory */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-xl p-6"
        >
          <TheorySection />
        </motion.section>
      </div>
    </div>
  );
}
