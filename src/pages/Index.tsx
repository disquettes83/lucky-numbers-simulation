
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LottoTicket from '@/components/LottoTicket';
import DrawResults from '@/components/DrawResults';
import StatsPanel from '@/components/StatsPanel';
import { drawLottoNumbers, calculateWinnings } from '@/lib/lottery';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProfileCreation from '@/components/ProfileCreation';
import PlayerProfile from '@/components/PlayerProfile';
import { usePlayer } from '@/contexts/PlayerContext';
import { confetti } from '@/lib/confetti';

const TICKET_COST = 1; // Costo di una schedina in euro (cambiato da 2 a 1 come richiesto)

const Index = () => {
  const { profile, playTicket, addWinning } = usePlayer();
  const [playerNumbers, setPlayerNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  
  // Statistiche salvate in local storage
  const [moneySpent, setMoneySpent] = useState(0);
  const [moneyWon, setMoneyWon] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showStats, setShowStats] = useState(false);
  
  // Carica statistiche da local storage
  useEffect(() => {
    try {
      const stats = localStorage.getItem('lottoStats');
      if (stats) {
        const { spent, won, games } = JSON.parse(stats);
        setMoneySpent(spent);
        setMoneyWon(won);
        setGamesPlayed(games);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle statistiche', error);
    }
  }, []);
  
  // Salva statistiche in local storage
  useEffect(() => {
    if (gamesPlayed > 0) {
      localStorage.setItem('lottoStats', JSON.stringify({
        spent: moneySpent,
        won: moneyWon,
        games: gamesPlayed
      }));
    }
  }, [moneySpent, moneyWon, gamesPlayed]);
  
  // Gestisce la giocata
  const handlePlay = async (numbers: number[]) => {
    // Verifica che il giocatore abbia abbastanza soldi
    if (profile && profile.balance < TICKET_COST) {
      toast.error("Non hai abbastanza soldi per giocare!");
      return;
    }
    
    setPlayerNumbers(numbers);
    setDrawnNumbers(null);
    setIsDrawing(true);
    setWinAmount(0);
    
    // Aggiorna il profilo del giocatore
    if (profile) {
      playTicket(TICKET_COST);
    }
    
    // Aggiorna le statistiche generali
    setMoneySpent(prev => prev + TICKET_COST);
    setGamesPlayed(prev => prev + 1);
    
    // Simula l'attesa dell'estrazione
    toast.info('Estrazione in corso...');
    
    setTimeout(() => {
      // Estrazione dei numeri
      const drawn = drawLottoNumbers();
      setDrawnNumbers(drawn);
      
      // Calcola vincita
      const win = calculateWinnings(numbers, drawn);
      setWinAmount(win);
      
      if (win > 0) {
        toast.success(`Hai vinto ${win.toFixed(2)} €!`);
        setMoneyWon(prev => prev + win);
        
        // Aggiorna il profilo del giocatore
        if (profile) {
          addWinning(win);
          
          // Effetto confetti per le vincite
          if (win >= 50) {
            confetti({
              particleCount: Math.min(500, win),
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } else {
        toast.error('Nessuna vincita. Ritenta!');
      }
      
      setIsDrawing(false);
    }, 3000);
  };
  
  // Inizia una nuova partita
  const handleNewGame = () => {
    setPlayerNumbers([]);
    setDrawnNumbers(null);
  };
  
  // Resetta le statistiche
  const handleResetStats = () => {
    if (confirm('Sei sicuro di voler azzerare tutte le statistiche?')) {
      setMoneySpent(0);
      setMoneyWon(0);
      setGamesPlayed(0);
      localStorage.removeItem('lottoStats');
      toast.success('Statistiche azzerate');
    }
  };
  
  // Se non c'è un profilo, mostra la schermata di creazione
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow">
          <ProfileCreation />
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">SuperEnaLosso</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Una simulazione realistica del SuperEnalotto. Scegli i tuoi numeri e prova a vincere! 
            Le probabilità riflettono quelle reali, ma i soldi sono virtuali.
          </p>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {!drawnNumbers ? (
              <LottoTicket onPlay={handlePlay} ticketCost={TICKET_COST} />
            ) : (
              <DrawResults 
                playerNumbers={playerNumbers}
                drawnNumbers={drawnNumbers}
                winAmount={winAmount}
                onNewGame={handleNewGame}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <PlayerProfile />
            
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-md text-center">
              <p className="text-lg font-semibold mb-2">💡 Lo sapevi che...</p>
              <p className="text-sm text-muted-foreground mb-2">
                La probabilità di vincere il jackpot al SuperEnalotto è di circa 1 su 622 milioni.
              </p>
              <p className="text-xs text-muted-foreground">
                È più probabile essere colpiti da un asteroide che vincere il jackpot.
              </p>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" /> Nascondi statistiche
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" /> Mostra statistiche
                  </>
                )}
              </Button>
              
              {showStats && (
                <div className="space-y-4">
                  <StatsPanel 
                    moneySpent={moneySpent}
                    moneyWon={moneyWon}
                    gamesPlayed={gamesPlayed}
                  />
                  
                  {gamesPlayed > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs text-red-500 hover:text-red-600"
                      onClick={handleResetStats}
                    >
                      Azzera statistiche
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-200 py-4 text-center text-sm text-muted-foreground">
        <p>Questa è una simulazione. Non incoraggiamo il gioco d'azzardo reale.</p>
        <p className="text-xs">Il gioco è vietato ai minori e può causare dipendenza patologica.</p>
      </footer>
    </div>
  );
};

export default Index;
