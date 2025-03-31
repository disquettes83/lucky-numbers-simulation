
import React from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Euro, User, Home, Heart, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

const PlayerProfile: React.FC = () => {
  const { profile } = usePlayer();
  
  if (!profile) return null;
  
  // Traduzioni per gli stati
  const maritalStatusText = {
    'single': 'Single',
    'sposato': 'Sposato',
    'vedovo': 'Vedovo',
    'divorziato': 'Divorziato'
  };
  
  const socialStatusText = {
    'povero': 'In difficoltà',
    'classe media': 'Classe media',
    'benestante': 'Benestante',
    'ricco': 'Agiato'
  };
  
  // Determina il colore del karma
  const getKarmaColor = () => {
    if (profile.karma <= 3) return 'bg-red-500';
    if (profile.karma <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Profilo Giocatore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold text-xl">{profile.name}</h3>
          <div className="flex flex-col text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Età:</span>
              <span>{profile.age} anni</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>{profile.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span>{maritalStatusText[profile.maritalStatus]}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{socialStatusText[profile.socialStatus]}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-3 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Bilancio</span>
              <span className="font-bold">{profile.balance.toFixed(2)} €</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs mt-2">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <div>
                  <div className="text-muted-foreground">Entrate</div>
                  <div className="font-medium">{profile.weeklyIncome.toFixed(2)} €/sett</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <div>
                  <div className="text-muted-foreground">Spese</div>
                  <div className="font-medium">{profile.fixedExpenses.toFixed(2)} €/sett</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Karma</span>
              <span className="font-bold">{profile.karma}/10</span>
            </div>
            <Progress 
              value={profile.karma * 10} 
              className="h-2" 
              indicatorClassName={getKarmaColor()} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Schedine giocate</span>
              <span className="font-bold">{profile.playedTickets}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Soldi spesi</span>
              <span className="font-bold text-red-500">{profile.moneySpent.toFixed(2)} €</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Soldi vinti</span>
              <span className="font-bold text-green-500">{profile.moneyWon.toFixed(2)} €</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Bilancio gioco</span>
              <span className={`font-bold ${profile.moneyWon - profile.moneySpent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {(profile.moneyWon - profile.moneySpent).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
