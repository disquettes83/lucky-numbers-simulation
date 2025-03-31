
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PlayerProfile, 
  generateRandomProfile, 
  savePlayerProfile, 
  loadPlayerProfile,
  updateKarma,
  updateBalance,
  recordTicketPlayed,
  recordWinnings
} from '@/lib/player';

interface PlayerContextType {
  profile: PlayerProfile | null;
  loading: boolean;
  generateNewProfile: () => void;
  resetProfile: () => void;
  modifyKarma: (amount: number) => void;
  modifyBalance: (amount: number) => void;
  playTicket: (cost: number) => void;
  addWinning: (amount: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carica il profilo dal localStorage all'avvio
  useEffect(() => {
    const loadedProfile = loadPlayerProfile();
    setProfile(loadedProfile);
    setLoading(false);
  }, []);
  
  // Salva il profilo nel localStorage quando cambia
  useEffect(() => {
    if (profile) {
      savePlayerProfile(profile);
    }
  }, [profile]);
  
  // Genera un nuovo profilo casuale
  const generateNewProfile = () => {
    const newProfile = generateRandomProfile();
    setProfile(newProfile);
  };
  
  // Reimposta il profilo
  const resetProfile = () => {
    localStorage.removeItem('playerProfile');
    setProfile(null);
  };
  
  // Modifica il karma
  const modifyKarma = (amount: number) => {
    if (profile) {
      setProfile(updateKarma(profile, amount));
    }
  };
  
  // Modifica il bilancio
  const modifyBalance = (amount: number) => {
    if (profile) {
      setProfile(updateBalance(profile, amount));
    }
  };
  
  // Registra una schedina giocata
  const playTicket = (cost: number) => {
    if (profile) {
      setProfile(recordTicketPlayed(profile, cost));
    }
  };
  
  // Registra una vincita
  const addWinning = (amount: number) => {
    if (profile) {
      setProfile(recordWinnings(profile, amount));
    }
  };
  
  const value = {
    profile,
    loading,
    generateNewProfile,
    resetProfile,
    modifyKarma,
    modifyBalance,
    playTicket,
    addWinning
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  
  return context;
};
