
import { PlayerProfile } from './player';

// Definizione del tipo di evento
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  karmaEffect?: number;
  moneyEffect?: number;
  // La probabilità è espressa come numero da 0 a 100
  probability: number;
  // Condizione opzionale che deve essere soddisfatta perché l'evento si verifichi
  condition?: (profile: PlayerProfile) => boolean;
}

// Eventi positivi
export const positiveEvents: GameEvent[] = [
  {
    id: 'found_money',
    title: 'Hai trovato dei soldi per strada',
    description: 'Camminando per strada hai trovato una banconota caduta da qualche portafoglio.',
    moneyEffect: 20,
    karmaEffect: -0.2,
    probability: 5
  },
  {
    id: 'helped_elderly',
    title: 'Hai aiutato un anziano',
    description: 'Hai aiutato un anziano a portare la spesa fino a casa. Ti ha ringraziato calorosamente.',
    karmaEffect: 0.5,
    probability: 8
  },
  {
    id: 'small_win',
    title: 'Gratta e vinci fortunato',
    description: 'Hai comprato un gratta e vinci e hai vinto una piccola somma!',
    moneyEffect: 10,
    probability: 7
  },
  {
    id: 'tax_refund',
    title: 'Rimborso fiscale',
    description: 'Hai ricevuto un rimborso fiscale inaspettato.',
    moneyEffect: 100,
    probability: 3,
    condition: (profile) => profile.socialStatus !== 'povero'
  },
  {
    id: 'work_bonus',
    title: 'Bonus lavorativo',
    description: 'Il tuo datore di lavoro ti ha concesso un bonus per i buoni risultati.',
    moneyEffect: 200,
    probability: 2,
    condition: (profile) => profile.socialStatus !== 'povero' && profile.karma > 5
  }
];

// Eventi negativi
export const negativeEvents: GameEvent[] = [
  {
    id: 'parking_ticket',
    title: 'Multa per divieto di sosta',
    description: 'Hai parcheggiato in divieto di sosta e hai preso una multa.',
    moneyEffect: -40,
    probability: 5,
    condition: (profile) => profile.socialStatus !== 'povero'
  },
  {
    id: 'broke_item',
    title: 'Oggetto rotto',
    description: 'Si è rotto un elettrodomestico e hai dovuto ripararlo.',
    moneyEffect: -80,
    probability: 6,
    condition: (profile) => profile.socialStatus !== 'povero'
  },
  {
    id: 'medical_expense',
    title: 'Spesa medica imprevista',
    description: 'Hai dovuto sostenere una spesa medica imprevista.',
    moneyEffect: -120,
    probability: 4
  },
  {
    id: 'bad_investment',
    title: 'Investimento sbagliato',
    description: 'Hai fatto un piccolo investimento che si è rivelato un fallimento.',
    moneyEffect: -150,
    probability: 3,
    condition: (profile) => profile.socialStatus === 'benestante' || profile.socialStatus === 'ricco'
  },
  {
    id: 'argument',
    title: 'Litigio con un vicino',
    description: 'Hai litigato con un vicino per futili motivi.',
    karmaEffect: -0.3,
    probability: 7
  }
];

// Eventi neutri
export const neutralEvents: GameEvent[] = [
  {
    id: 'weather_change',
    title: 'Cambiamento meteo',
    description: 'Il tempo è cambiato improvvisamente oggi.',
    probability: 15
  },
  {
    id: 'met_friend',
    title: 'Incontro casuale',
    description: 'Hai incontrato un vecchio amico per strada.',
    karmaEffect: 0.1,
    probability: 10
  },
  {
    id: 'newspaper_article',
    title: 'Articolo interessante',
    description: 'Hai letto un articolo interessante sul giornale riguardo alla probabilità nelle lotterie.',
    probability: 12
  }
];

// Funzione per ottenere un evento casuale
export function getRandomEvent(profile: PlayerProfile): GameEvent | null {
  // Combinare tutti gli eventi
  const allEvents = [...positiveEvents, ...negativeEvents, ...neutralEvents];
  
  // Filtriamo gli eventi in base alle condizioni
  const possibleEvents = allEvents.filter(event => {
    // Se c'è una condizione, la verifichiamo
    if (event.condition) {
      return event.condition(profile);
    }
    return true;
  });
  
  // Calcoliamo la somma totale delle probabilità
  const totalProbability = possibleEvents.reduce((sum, event) => sum + event.probability, 0);
  
  // Generare un numero casuale tra 0 e la somma delle probabilità
  const randomValue = Math.random() * totalProbability;
  
  // Troviamo l'evento corrispondente al valore casuale
  let cumulativeProbability = 0;
  
  for (const event of possibleEvents) {
    cumulativeProbability += event.probability;
    if (randomValue <= cumulativeProbability) {
      return event;
    }
  }
  
  // Se arriviamo qui, è un caso in cui non si verifica nessun evento
  return null;
}

// Funzione per applicare un evento al profilo del giocatore
export function applyEventToProfile(profile: PlayerProfile, event: GameEvent): PlayerProfile {
  let updatedProfile = { ...profile };
  
  // Applicare l'effetto sul karma se presente
  if (event.karmaEffect) {
    updatedProfile.karma = Math.max(0, Math.min(10, updatedProfile.karma + event.karmaEffect));
  }
  
  // Applicare l'effetto sul bilancio se presente
  if (event.moneyEffect) {
    updatedProfile.balance += event.moneyEffect;
  }
  
  return updatedProfile;
}

// Costante per controllare la probabilità complessiva che si verifichi un evento
export const EVENT_OCCURRENCE_PROBABILITY = 40; // 40% di probabilità che si verifichi un evento

// Funzione per determinare se un evento deve verificarsi
export function shouldEventOccur(): boolean {
  return Math.random() * 100 <= EVENT_OCCURRENCE_PROBABILITY;
}
