
import React from 'react';
import { Euro } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Euro className="h-6 w-6" />
          <h1 className="text-2xl font-bold">SuperEnaLosso</h1>
        </div>
        <p className="text-sm md:text-base italic">
          Giocheresti a un gioco dove non vinci mai?
        </p>
      </div>
    </header>
  );
};

export default Header;
