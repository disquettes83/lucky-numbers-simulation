
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays, isEqual, getDay, isSameDay, addWeeks, addMonths, isFirstDayOfMonth } from 'date-fns';
import { usePlayer } from './PlayerContext';
import { toast } from 'sonner';
import { getRandomEvent, shouldEventOccur, applyEventToProfile } from '@/lib/events';

// Days of the week for lotto draws
const DRAW_DAYS = [2, 4, 5, 6]; // Tuesday, Thursday, Friday, Saturday (0 = Sunday, 1 = Monday, etc.)

interface TimeContextType {
  currentDate: Date;
  advanceTime: (days: number) => void;
  isDrawDay: boolean;
  nextDrawDate: Date;
  daysUntilNextDraw: number;
  daysUntilSalary: number;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Start with the current real date
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const storedDate = localStorage.getItem('gameCurrentDate');
    return storedDate ? new Date(storedDate) : new Date();
  });
  
  const { profile, modifyBalance, modifyKarma } = usePlayer();
  
  // Save current date to localStorage when it changes
  useEffect(() => {
    if (currentDate) {
      localStorage.setItem('gameCurrentDate', currentDate.toISOString());
    }
  }, [currentDate]);
  
  // Check if today is a draw day
  const isDrawDay = DRAW_DAYS.includes(getDay(currentDate));
  
  // Calculate next draw date
  const getNextDrawDate = (): Date => {
    let testDate = new Date(currentDate);
    let daysChecked = 0;
    
    while (daysChecked < 7) {
      testDate = addDays(testDate, 1);
      daysChecked++;
      if (DRAW_DAYS.includes(getDay(testDate))) {
        return testDate;
      }
    }
    
    // Fallback (shouldn't happen)
    return addDays(currentDate, 1);
  };
  
  const nextDrawDate = getNextDrawDate();
  
  // Calculate days until next draw
  const calculateDaysUntil = (targetDate: Date): number => {
    let tempDate = new Date(currentDate);
    let days = 0;
    
    while (!isSameDay(tempDate, targetDate)) {
      tempDate = addDays(tempDate, 1);
      days++;
      
      if (days > 7) return 7; // Safeguard
    }
    
    return days;
  };
  
  const daysUntilNextDraw = calculateDaysUntil(nextDrawDate);
  
  // Calculate days until next salary payment (first day of month)
  const getNextSalaryDate = (): Date => {
    if (isFirstDayOfMonth(currentDate)) return currentDate;
    
    let nextMonth = addMonths(currentDate, 1);
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  };
  
  const nextSalaryDate = getNextSalaryDate();
  const daysUntilSalary = calculateDaysUntil(nextSalaryDate);
  
  // Procedura per gestire un evento casuale
  const handleRandomEvent = () => {
    if (!profile) return;
    
    // Verifichiamo se deve verificarsi un evento
    if (shouldEventOccur()) {
      // Otteniamo un evento casuale
      const event = getRandomEvent(profile);
      
      if (event) {
        // Mostriamo il toast dell'evento
        toast.info(event.title, {
          description: event.description,
          duration: 6000,
        });
        
        // Applicare gli effetti dell'evento
        if (event.karmaEffect) {
          modifyKarma(event.karmaEffect);
          const karmaChange = event.karmaEffect > 0 ? `+${event.karmaEffect}` : event.karmaEffect;
          toast.info(`Karma: ${karmaChange}`);
        }
        
        if (event.moneyEffect) {
          modifyBalance(event.moneyEffect);
          const moneySign = event.moneyEffect > 0 ? '+' : '';
          toast.info(`Bilancio: ${moneySign}${event.moneyEffect.toFixed(2)}€`);
        }
      }
    }
  };
  
  // Advance time by specified number of days
  const advanceTime = (days: number) => {
    let newDate = currentDate;
    let remainingDays = days;
    
    // Handle one day at a time to check for events
    while (remainingDays > 0) {
      newDate = addDays(newDate, 1);
      remainingDays--;
      
      // Check for salary day (first of month)
      if (isFirstDayOfMonth(newDate) && profile) {
        const salary = profile.weeklyIncome * 4; // Monthly income
        const expenses = profile.fixedExpenses * 4; // Monthly expenses
        const net = salary - expenses;
        
        modifyBalance(net);
        
        if (net > 0) {
          toast.success(`Hai ricevuto lo stipendio: +${salary.toFixed(2)}€`);
          toast.info(`Spese mensili: -${expenses.toFixed(2)}€`);
          toast.info(`Bilancio netto: ${net > 0 ? '+' : ''}${net.toFixed(2)}€`);
        } else {
          toast.error(`Le tue spese hanno superato lo stipendio: ${net.toFixed(2)}€`);
        }
      }
      
      // Check for draw day
      if (DRAW_DAYS.includes(getDay(newDate))) {
        toast.info(`Oggi c'è l'estrazione del SuperEnaLosso!`, {
          description: `${format(newDate, 'EEEE d MMMM yyyy')}`
        });
      }
      
      // Gestione evento casuale per ogni giorno
      handleRandomEvent();
    }
    
    setCurrentDate(newDate);
  };
  
  const value = {
    currentDate,
    advanceTime,
    isDrawDay,
    nextDrawDate,
    daysUntilNextDraw,
    daysUntilSalary
  };
  
  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = (): TimeContextType => {
  const context = useContext(TimeContext);
  
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  
  return context;
};
