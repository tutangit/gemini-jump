
import React, { useState, useEffect, useCallback } from 'react';
import GameScene from './components/GameScene';
import { GameState, GameStats } from './types';
import { getGeminiCommentary } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highestPlatform: 0,
    aiComment: "Pronto para pular?"
  });
  const [lastMilestone, setLastMilestone] = useState(0);

  const startGame = async () => {
    setGameState(GameState.PLAYING);
    setStats({ score: 0, highestPlatform: 0, aiComment: "Subindo!" });
    setLastMilestone(0);
    const welcome = await getGeminiCommentary(0, 'win');
    setStats(prev => ({ ...prev, aiComment: welcome }));
  };

  const handleGameOver = useCallback(async (finalScore: number) => {
    setGameState(GameState.GAMEOVER);
    const comment = await getGeminiCommentary(finalScore, 'fail');
    setStats(prev => ({ ...prev, score: finalScore, aiComment: comment }));
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setStats(prev => ({ ...prev, score: newScore }));
    
    // Check for milestone every 100 points
    if (newScore > lastMilestone + 100) {
      setLastMilestone(newScore);
      getGeminiCommentary(newScore, 'milestone').then(comment => {
        setStats(prev => ({ ...prev, aiComment: comment }));
      });
    }
  }, [lastMilestone]);

  return (
    <div className="relative w-full h-screen bg-slate-900 font-sans text-white overflow-hidden">
      {/* Game View */}
      {gameState === GameState.PLAYING && (
        <GameScene onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} />
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">
        
        {/* Top Bar */}
        <div className="w-full flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <h1 className="text-2xl font-black italic tracking-tighter text-blue-400">GEMINI JUMP</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest">3D Platformer</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-baseline gap-4">
              <span className="text-sm text-white/60 font-bold">ALTITUDE</span>
              <span className="text-3xl font-mono font-black text-white tabular-nums">
                {stats.score.toLocaleString()}m
              </span>
            </div>
          </div>
        </div>

        {/* AI Commentary Bubble */}
        <div className="mb-20 animate-bounce-slow">
           <div className="bg-blue-600/90 backdrop-blur-lg px-6 py-3 rounded-2xl rounded-bl-none shadow-2xl shadow-blue-500/20 border border-blue-400/30 max-w-xs text-center">
             <p className="text-sm font-medium italic">"{stats.aiComment}"</p>
           </div>
        </div>
      </div>

      {/* Menus */}
      {gameState === GameState.START && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-2">
              <h2 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tighter">
                DESAFIO 3D
              </h2>
              <p className="text-slate-400">Até onde você consegue chegar?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="block text-xs text-blue-400 font-bold uppercase mb-1">Controles</span>
                <p className="text-sm">WASD para mover<br/>Espaço para pular</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="block text-xs text-emerald-400 font-bold uppercase mb-1">Dica</span>
                <p className="text-sm">O Gemini comenta seu desempenho em tempo real!</p>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
            >
              INICIAR JORNADA
            </button>
          </div>
        </div>
      )}

      {gameState === GameState.GAMEOVER && (
        <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="space-y-4">
               <h2 className="text-7xl font-black text-white italic tracking-tighter">QUEDA!</h2>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                  <p className="text-slate-300 uppercase text-xs font-bold tracking-widest mb-2">Altitude Final</p>
                  <p className="text-5xl font-mono font-black text-blue-400">{stats.score}m</p>
               </div>
               <div className="p-4 bg-black/30 rounded-2xl italic text-slate-200 border-l-4 border-red-500">
                  "{stats.aiComment}"
               </div>
             </div>

             <button 
              onClick={startGame}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xl transition-all hover:bg-slate-200 active:scale-95"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
