
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CoinsIcon, TrendingUp, TrendingDown, Ticket } from 'lucide-react';

interface StatsPanelProps {
  moneySpent: number;
  moneyWon: number;
  gamesPlayed: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  moneySpent,
  moneyWon,
  gamesPlayed,
}) => {
  const returnRate = moneySpent > 0 ? (moneyWon / moneySpent) * 100 : 0;
  const profit = moneyWon - moneySpent;
  const isProfitable = profit >= 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Statistiche di gioco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Ticket className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Giocate effettuate</span>
              </div>
              <span className="font-bold">{gamesPlayed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Soldi spesi</span>
              </div>
              <span className="font-bold text-red-500">-{moneySpent.toFixed(2)} €</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Soldi vinti</span>
              </div>
              <span className="font-bold text-green-500">+{moneyWon.toFixed(2)} €</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CoinsIcon className="mr-2 h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Bilancio</span>
              </div>
              <span className={`font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                {isProfitable ? '+' : ''}{profit.toFixed(2)} €
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tasso di ritorno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Progress value={returnRate} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold">{returnRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">
                Hai recuperato il {returnRate.toFixed(1)}% di quanto hai speso
              </p>
              {returnRate < 100 && (
                <p className="text-xs text-red-500 mt-2 italic">
                  {moneySpent > 0 ? `Hai perso ${(moneySpent - moneyWon).toFixed(2)} €` : ''}
                </p>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground text-center italic">
              <p>Le lotterie hanno un tasso di ritorno medio di circa 50%</p>
              <p>Il SuperEnalotto ha un tasso di ritorno di circa 34%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
