'use client';
import React, { createContext, useContext, useState } from "react";

interface StaticContextType {
    totalValue: number | null;
    setTotalValue: React.Dispatch<React.SetStateAction<number | null>>;
    totalSale: number | null;
    setTotalSale: React.Dispatch<React.SetStateAction<number | null>>;
}

const StaticContext = createContext<StaticContextType | undefined>(undefined);

export const StaticProvider = ({ children }: { children: React.ReactNode }) => {
    const [totalValue, setTotalValue] = useState<number | null>(null);
    const [totalSale, setTotalSale] = useState<number | null>(null);

    return (
        <StaticContext.Provider value={{ totalValue, setTotalValue, totalSale, setTotalSale }}>
            {children}
        </StaticContext.Provider>
    );
};

export const useStaticContext = () => {
    const context = useContext(StaticContext);
    if (!context) {
        throw new Error("useStaticContext must be used within an StaticProvider");
    }
    return context;
};
