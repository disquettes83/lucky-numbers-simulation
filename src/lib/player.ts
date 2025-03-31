
// Tipi di dati per il profilo del giocatore
export type MaritalStatus = 'single' | 'sposato' | 'vedovo' | 'divorziato';
export type SocialStatus = 'povero' | 'classe media' | 'benestante' | 'ricco';

export interface PlayerProfile {
  name: string;
  age: number;
  city: string;
  socialStatus: SocialStatus;
  maritalStatus: MaritalStatus;
  balance: number;
  weeklyIncome: number;
  fixedExpenses: number;
  karma: number; // da 0 a 10
  playedTickets: number;
  moneySpent: number;
  moneyWon: number;
}

// Nomi e cognomi casuali
const firstNames = [
  'Marco', 'Giuseppe', 'Antonio', 'Giovanni', 'Francesco', 
  'Maria', 'Anna', 'Lucia', 'Giovanna', 'Rosa'
];

const lastNames = [
  'Rossi', 'Bianchi', 'Esposito', 'Romano', 'Colombo',
  'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Ferrari'
];

// Città italiane
const italianCities = [
  'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo',
  'Bologna', 'Firenze', 'Bari', 'Catania', 'Venezia'
];

// Genera un profilo giocatore casuale
export function generateRandomProfile(): PlayerProfile {
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const age = Math.floor(Math.random() * 50) + 20; // età tra 20 e 70
  const city = italianCities[Math.floor(Math.random() * italianCities.length)];
  
  // Stato sociale con distribuzione realistica
  const socialRoll = Math.random();
  let socialStatus: SocialStatus;
  if (socialRoll < 0.2) socialStatus = 'povero';
  else if (socialRoll < 0.7) socialStatus = 'classe media';
  else if (socialRoll < 0.95) socialStatus = 'benestante';
  else socialStatus = 'ricco';
  
  // Stato civile
  const maritalRoll = Math.random();
  let maritalStatus: MaritalStatus;
  if (maritalRoll < 0.4) maritalStatus = 'single';
  else if (maritalRoll < 0.75) maritalStatus = 'sposato';
  else if (maritalRoll < 0.9) maritalStatus = 'divorziato';
  else maritalStatus = 'vedovo';
  
  // Reddito settimanale basato su stato sociale
  let weeklyIncome: number;
  switch (socialStatus) {
    case 'povero': weeklyIncome = 150 + Math.floor(Math.random() * 100); break;
    case 'classe media': weeklyIncome = 300 + Math.floor(Math.random() * 150); break;
    case 'benestante': weeklyIncome = 500 + Math.floor(Math.random() * 300); break;
    case 'ricco': weeklyIncome = 1000 + Math.floor(Math.random() * 1000); break;
  }
  
  // Spese fisse settimanali (proporzionali al reddito)
  const fixedExpenses = Math.floor(weeklyIncome * (0.5 + Math.random() * 0.3));
  
  // Bilancio iniziale (2-5 settimane di reddito netto)
  const weeklyNet = weeklyIncome - fixedExpenses;
  const balance = weeklyNet * (2 + Math.floor(Math.random() * 4));
  
  // Karma iniziale (media-alto per dare spazio a diminuzioni)
  const karma = 5 + Math.floor(Math.random() * 4);
  
  return {
    name,
    age,
    city,
    socialStatus,
    maritalStatus,
    balance,
    weeklyIncome,
    fixedExpenses,
    karma,
    playedTickets: 0,
    moneySpent: 0,
    moneyWon: 0
  };
}

// Salva il profilo nel localStorage
export function savePlayerProfile(profile: PlayerProfile): void {
  localStorage.setItem('playerProfile', JSON.stringify(profile));
}

// Carica il profilo dal localStorage
export function loadPlayerProfile(): PlayerProfile | null {
  const stored = localStorage.getItem('playerProfile');
  return stored ? JSON.parse(stored) : null;
}

// Modifica il karma del giocatore
export function updateKarma(profile: PlayerProfile, amount: number): PlayerProfile {
  const newKarma = Math.max(0, Math.min(10, profile.karma + amount));
  return { ...profile, karma: newKarma };
}

// Aggiorna il bilancio
export function updateBalance(profile: PlayerProfile, amount: number): PlayerProfile {
  return { ...profile, balance: profile.balance + amount };
}

// Aggiorna le statistiche dopo aver giocato
export function recordTicketPlayed(profile: PlayerProfile, cost: number): PlayerProfile {
  return {
    ...profile,
    balance: profile.balance - cost,
    playedTickets: profile.playedTickets + 1,
    moneySpent: profile.moneySpent + cost
  };
}

// Aggiorna le statistiche dopo una vincita
export function recordWinnings(profile: PlayerProfile, amount: number): PlayerProfile {
  return {
    ...profile,
    balance: profile.balance + amount,
    moneyWon: profile.moneyWon + amount
  };
}
