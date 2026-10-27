"use client";

import { useState, useEffect } from "react";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { TotalBlock } from "@/components/calculator/TotalBlock";
import type { CalcResult } from "@/lib/calc/types";

interface Rates {
  usdToByn: number;
  eurToByn: number;
  eurToUsd: number;
}

export default function Home() {
  const [result, setResult] = useState<CalcResult | null>(null);
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data) => {
        if (data.usdToByn) setRates(data);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-gray-900">
            Калькулятор растаможки авто
          </h1>
          {rates && (
            <div className="text-xs text-gray-600 flex gap-4">
              <span>USD: {rates.usdToByn.toFixed(4)} BYN</span>
              <span>EUR: {rates.eurToByn.toFixed(4)} BYN</span>
              <span className="text-gray-400">НБРБ</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <CalculatorForm rates={rates} onResult={setResult} />
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TotalBlock result={result} />
          </div>
        </aside>
      </div>
    </main>
  );
}