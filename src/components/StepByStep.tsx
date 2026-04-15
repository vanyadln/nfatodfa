import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConversionStep } from '@/lib/nfa-to-dfa';

interface Props {
  steps: ConversionStep[];
}

const typeColors: Record<string, string> = {
  'epsilon-closure': 'text-success',
  'subset-construction': 'text-primary',
  'new-state': 'text-accent',
  'transition': 'text-warning',
  'final': 'text-success',
};

const typeBadgeColors: Record<string, string> = {
  'epsilon-closure': 'bg-success/20 text-success',
  'subset-construction': 'bg-primary/20 text-primary',
  'new-state': 'bg-accent/20 text-accent',
  'transition': 'bg-warning/20 text-warning',
  'final': 'bg-success/20 text-success',
};

export default function StepByStep({ steps }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [steps]);

  const showNext = () => {
    setVisibleCount(prev => Math.min(prev + 1, steps.length));
  };

  const showAll = () => setVisibleCount(steps.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Step-by-Step Conversion</h3>
        <div className="flex gap-2">
          <Button onClick={showNext} disabled={visibleCount >= steps.length} size="sm" variant="secondary" className="gap-1">
            <ChevronRight className="w-4 h-4" /> Next Step
          </Button>
          <Button onClick={showAll} disabled={visibleCount >= steps.length} size="sm" variant="outline" className="gap-1">
            <FastForward className="w-4 h-4" /> Show All
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence>
          {steps.slice(0, visibleCount).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Step {i + 1}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeBadgeColors[step.type]}`}>
                  {step.type.replace('-', ' ')}
                </span>
              </div>
              <p className={`font-semibold text-sm ${typeColors[step.type]}`}>{step.description}</p>
              <p className="text-xs font-mono text-muted-foreground">{step.detail}</p>
              {step.highlightStates && step.highlightStates.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-1">
                  {step.highlightStates.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleCount === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">Click "Next Step" to begin the conversion walkthrough</p>
        )}
      </div>
    </div>
  );
}
