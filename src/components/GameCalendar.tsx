
import React from 'react';
import { useTime } from '@/contexts/TimeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isSameDay, getDay, addDays, addWeeks, isFirstDayOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarClock, CreditCard, Calendar as CalendarIcon } from 'lucide-react';

// Days of the week for lotto draws (Sunday = 0, Monday = 1, etc.)
const DRAW_DAYS = [2, 4, 5, 6]; // Tuesday, Thursday, Friday, Saturday

const GameCalendar: React.FC = () => {
  const { currentDate, advanceTime, isDrawDay, nextDrawDate, daysUntilNextDraw, daysUntilSalary } = useTime();
  
  // Custom styling for calendar days
  const isDayEventDay = (date: Date) => {
    // Check if draw day
    if (DRAW_DAYS.includes(getDay(date))) {
      return true;
    }
    
    // Check if salary day
    if (isFirstDayOfMonth(date)) {
      return true;
    }
    
    return false;
  };
  
  // Function to render calendar day content
  const dayContent = (date: Date) => {
    const drawDay = DRAW_DAYS.includes(getDay(date));
    const salaryDay = isFirstDayOfMonth(date);
    
    if (drawDay || salaryDay) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div>{date.getDate()}</div>
          {drawDay && (
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-0.5"></div>
          )}
          {salaryDay && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-0.5"></div>
          )}
        </div>
      );
    }
    
    return date.getDate();
  };
  
  // For each day, add a modifiers object for styling
  const modifiers = {
    drawDay: DRAW_DAYS.map(day => 
      (date: Date) => getDay(date) === day
    ),
    salaryDay: [(date: Date) => isFirstDayOfMonth(date)]
  };
  
  const modifiersStyles = {
    drawDay: { color: 'rgb(245 158 11)' },
    salaryDay: { color: 'rgb(34 197 94)' }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Calendario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center font-bold text-xl">
          {format(currentDate, "EEEE d MMMM yyyy", { locale: it })}
        </div>
        
        <Calendar 
          mode="single"
          selected={currentDate}
          onSelect={() => {}}
          locale={it}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled
          showOutsideDays={false}
          className="mx-auto"
        />
        
        <div className="space-y-2 border-t pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Estrazione
            </span>
            <Badge variant={isDrawDay ? "default" : "outline"} className={isDrawDay ? "bg-amber-500" : ""}>
              {isDrawDay ? "Oggi" : `Tra ${daysUntilNextDraw} ${daysUntilNextDraw === 1 ? 'giorno' : 'giorni'}`}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Stipendio
            </span>
            <Badge variant={daysUntilSalary === 0 ? "default" : "outline"} className={daysUntilSalary === 0 ? "bg-green-500" : ""}>
              {daysUntilSalary === 0 ? "Oggi" : `Tra ${daysUntilSalary} ${daysUntilSalary === 1 ? 'giorno' : 'giorni'}`}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => advanceTime(1)}
          >
            +1 Giorno
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => advanceTime(daysUntilNextDraw)}
          >
            Prossima Estrazione
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCalendar;
