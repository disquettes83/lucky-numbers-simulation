
import React, { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Gift, RefreshCw } from 'lucide-react';
import { confetti } from '@/lib/confetti';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  name: string;
  age: number;
  city: string;
  socialStatus: string;
  maritalStatus: string;
  balance: number;
  weeklyIncome: number;
  fixedExpenses: number;
  className?: string;
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name, age, city, socialStatus, maritalStatus, 
  balance, weeklyIncome, fixedExpenses, className, onClick
}) => {
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
  
  return (
    <Card className={cn("cursor-pointer hover:shadow-lg transition-all duration-300", className)} onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{age} anni, {city}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Stato:</span>
          <span>{maritalStatusText[maritalStatus]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Condizione economica:</span>
          <span>{socialStatusText[socialStatus]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bilancio:</span>
          <span className="font-medium">{balance.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entrate settimanali:</span>
          <span className="text-green-600">{weeklyIncome.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Spese settimanali:</span>
          <span className="text-red-600">{fixedExpenses.toFixed(2)} €</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Scegli questo profilo
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProfileCreation: React.FC = () => {
  const { generateNewProfile } = usePlayer();
  const [profiles, setProfiles] = useState(() => {
    // Genera 3 profili casuali iniziali
    return Array.from({ length: 3 }, generateRandomProfile);
  });
  
  const handleRefresh = () => {
    setProfiles(Array.from({ length: 3 }, generateRandomProfile));
  };
  
  const handleSelectProfile = (index: number) => {
    // Effetto visivo
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Imposta il profilo scelto
    const selectedProfile = profiles[index];
    localStorage.setItem('playerProfile', JSON.stringify(selectedProfile));
    generateNewProfile(); // Questo caricherà il profilo dal localStorage
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Inizia la tua avventura al SuperEnaLosso</h1>
        <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
          Scegli un profilo per iniziare la tua carriera da giocatore! 
          Ogni personaggio ha una situazione economica e personale diversa.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {profiles.map((profile, index) => (
          <ProfileCard 
            key={index}
            name={profile.name}
            age={profile.age}
            city={profile.city}
            socialStatus={profile.socialStatus}
            maritalStatus={profile.maritalStatus}
            balance={profile.balance}
            weeklyIncome={profile.weeklyIncome}
            fixedExpenses={profile.fixedExpenses}
            onClick={() => handleSelectProfile(index)}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Genera nuovi profili
        </Button>
      </div>
      
      <div className="mt-16 bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
        <div className="flex justify-center mb-2">
          <Gift className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-medium text-amber-800">Suggerimento</h3>
        <p className="text-sm text-amber-700">
          I giocatori con un bilancio più alto possono permettersi di giocare più a lungo, 
          ma ricorda che il SuperEnaLosso è un gioco dove le probabilità non sono mai a tuo favore!
        </p>
      </div>
    </div>
  );
};

export default ProfileCreation;
