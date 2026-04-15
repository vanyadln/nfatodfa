import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-2 rounded-xl btn-gradient glow-primary">
          <Zap className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-gradient">NFA → DFA</span>{' '}
          <span className="text-foreground">Visualizer</span>
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto">
        Interactive automata conversion with step-by-step visualization
      </p>
    </motion.header>
  );
}
