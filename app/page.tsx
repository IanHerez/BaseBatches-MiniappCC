"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useApp } from "./context/AppContext";
import { FloatingChat } from "./components/FloatingChat";
import { Dashboard } from "./components/Dashboard";

// Tipos
type Transaction = {
  title: string;
  date: string;
  amount: string;
  status: string;
};

type SectionType = 'home' | 'transactions' | 'budget' | 'settings' | 'dashboard';

// Componente de Bienvenida
const WelcomePopup = ({ onClose }: { onClose: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Generar partículas con diferentes propiedades
  const particles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 5,
      delay: Math.random() * 2,
      path: ['circle', 'zigzag', 'wave', 'spiral'][Math.floor(Math.random() * 4)],
      color: Math.random() > 0.7 ? '#FFA500' : '#FFD700',
      opacity: Math.random() * 0.4 + 0.4
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Efecto de partículas mejorado */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${`animate-float-${particle.path}`}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: particle.opacity,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        ))}
      </div>

      <div className={`relative bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Efecto de borde brillante */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-20 blur-xl animate-gradient-x" />
        
        {/* Logo Animado */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] blur-2xl opacity-40 animate-pulse" />
          <div className="absolute inset-0 rounded-3xl border-4 border-[#FFD700] opacity-60 animate-gradient-x" />
          <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-xl">
            <img 
              src="/LogoCC.svg" 
              alt="CampusCoin Logo" 
              className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none animate-shine" />
          </div>
        </div>

        {/* Contenido */}
        <div className="text-center relative">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] mb-4 animate-gradient-x">
            ¡Bienvenido a CampusCoin!
          </h2>
          <p className="text-[#B8B8B8] mb-6">
            Tu ecosistema universitario inteligente
          </p>
          
          {/* Botón de Acción */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-medium py-3 rounded-xl relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center">
              Explorar CampusCoin
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Actualizar los estilos de animación
const styles = `
@keyframes float-circle {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(100px, 50px) rotate(90deg);
  }
  50% {
    transform: translate(50px, 100px) rotate(180deg);
  }
  75% {
    transform: translate(-50px, 50px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes float-zigzag {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, -50px);
  }
  50% {
    transform: translate(100px, 0);
  }
  75% {
    transform: translate(50px, 50px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes float-wave {
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(75px, -25px) scale(1.2); }
  50% { transform: translate(150px, 0) scale(1); }
  75% { transform: translate(75px, 25px) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes float-spiral {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  25% { transform: translate(50px, -50px) rotate(90deg) scale(1.2); }
  50% { transform: translate(0, -100px) rotate(180deg) scale(1); }
  75% { transform: translate(-50px, -50px) rotate(270deg) scale(0.8); }
  100% { transform: translate(0, 0) rotate(360deg) scale(1); }
}

.animate-float-circle {
  animation: float-circle linear infinite;
}

.animate-float-zigzag {
  animation: float-zigzag ease-in-out infinite;
}

.animate-float-wave {
  animation: float-wave ease-in-out infinite;
}

.animate-float-spiral {
  animation: float-spiral ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-shine {
  animation: shine 2s linear infinite;
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
  background-size: 200% 200%;
}
`;

export default function App() {
  const { address, isConnected, connect } = useApp();
  const [activeTab, setActiveTab] = useState<SectionType>('home');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTabChange = (tab: SectionType) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'home':
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Bienvenido a CampusCoin</h1>
            {!isConnected && (
              <button
                onClick={() => connect()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Conectar Wallet
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <style>{styles}</style>
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            {['home', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab as SectionType)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? 'bg-[#FFD700] text-black'
                    : 'bg-[#1A1A1A] text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {isConnected && (
            <div className="text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          )}
        </nav>
        {renderContent()}
      </div>
    </main>
  );
}


