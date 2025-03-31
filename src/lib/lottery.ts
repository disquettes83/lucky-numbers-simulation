
// Funzioni di utilità per il gioco del lotto

// Genera estrazione di 6 numeri da 1 a 90
export function drawLottoNumbers(): number[] {
  const numbers = new Set<number>();
  
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 90) + 1);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

// Calcola la vincita in base ai numeri indovinati
export function calculateWinnings(playerNumbers: number[], drawnNumbers: number[]): number {
  // Conta i numeri indovinati
  const matches = playerNumbers.filter(num => drawnNumbers.includes(num)).length;
  
  // Tabella delle vincite (valori approssimativi)
  switch (matches) {
    case 6: // Jackpot
      return 10000000;
    case 5: // 5 numeri
      return 50000;
    case 4: // 4 numeri
      return 1000;
    case 3: // 3 numeri
      return 50;
    default:
      return 0;
  }
}
