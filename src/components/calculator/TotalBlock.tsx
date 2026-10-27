"use client";

import type { CalcResult } from "@/lib/calc/types";

interface Props {
  result: CalcResult | null;
}

export function TotalBlock({ result }: Props) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">
        Заполните форму слева и нажмите «Рассчитать» — итог появится здесь.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Итого
      </p>
      <p className="text-4xl font-bold text-blue-600 mt-1 mb-6">
        ${result.totalUsd.toFixed(2)}
      </p>

      <div className="space-y-2 text-sm">
        {result.lineItems.map((item) => (
          <div key={item.label} className="flex justify-between gap-2">
            <span className="text-gray-700">{item.label}</span>
            <span className="font-medium tabular-nums">
              ${item.amountUsd.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
        <span>Итого</span>
        <span className="text-blue-600 tabular-nums">
          ${result.totalUsd.toFixed(2)}
        </span>
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-4 space-y-1">
          {result.warnings.map((w) => (
            <p key={w} className="text-amber-600 text-xs">
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      <button
        type="button"
        className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-black"
        onClick={() => {
          // TODO: POST /api/calculations
          alert("Сохранение пока не реализовано");
        }}
      >
        Сохранить расчёт
      </button>
    </div>
  );
}