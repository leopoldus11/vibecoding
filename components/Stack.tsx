
import React from 'react';
import { Zap } from 'lucide-react';

const Stack: React.FC = () => {
  const tools = ["Antigravity", "Claude 3.5 Sonnet", "Cursor", "Gemini 2.5", "MCP (Model Context Protocol)"];

  return (
    <section id="stack" className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
          <div className="max-w-md">
            <div className="inline-flex items-center space-x-2 text-gray-400 mb-4">
              <Zap size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Industry Standard</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">The Modern Stack.</h2>
            <p className="text-gray-400 text-lg">
              We don't teach "coding". We teach <strong>Context Orchestration</strong> using the world's most powerful AI development tools.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <div 
                key={i} 
                className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm font-mono text-gray-400">0{i+1}.</span>
                <p className="mt-2 font-semibold text-lg">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
