"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calcInputSchema } from "@/lib/validation/calculation.schema";
import { calcAuctionFees } from "@/lib/calc/auction-fees"; // Импортируем функцию сборов
import type { z } from "zod";
import type { CalcResult } from "@/lib/calc/types";

type FormData = z.infer<typeof calcInputSchema>;

interface Props {
  rates: FormData["rates"] | null;
  onResult: (r: CalcResult) => void;
}

interface Location {
  id: string;
  code: string;
  name: string;
}

export function CalculatorForm({ rates, onResult }: Props) {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const { register, handleSubmit, setValue, control } = useForm<FormData>({
    resolver: zodResolver(calcInputSchema),
    defaultValues: {
      auctionPrice: 5000,
      ageCategory: "3to5",
      engineVolumeCcm: 2000,
      customsValueEur: 10000, // Значение по умолчанию (будет перезаписано)
      conclusionCostByn: 100,
      evaluationCostByn: 200,
      auction: "copart",
      locationCode: "",
      port: "klaipeda",
      
      deliveryToPortUsd: 400,
      oceanFreightUsd: 1500,
      deliveryToMinskUsd: 500,

      vehicleType: "passenger",
      engineType: "gasoline",
      isPrivileged: false,
      privilegedFeeUsd: 500,
      docs: { epts: true, registration: true, deregistration: true, svh: true },
      rates: { usdToByn: 3.0, eurToByn: 3.3, eurToUsd: 1.1 },
    },
  });

  const selectedAuction = useWatch({ control, name: "auction" });
  const isPrivileged = useWatch({ control, name: "isPrivileged" });
  const ageCategory = useWatch({ control, name: "ageCategory" });
  const auctionPrice = useWatch({ control, name: "auctionPrice" });
  const currentRates = useWatch({ control, name: "rates" });

  // Эффект для загрузки площадок
  useEffect(() => {
    if (!selectedAuction) return;
    fetch(`/api/locations?auction=${selectedAuction}`)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        if (data.length > 0) setValue("locationCode", data[0].code);
      })
      .catch(console.error);
  }, [selectedAuction, setValue]);

  // Эффект для подстановки курсов с сервера
  useEffect(() => {
    if (rates) setValue("rates", rates);
  }, [rates, setValue]);

  // ЭФФЕКТ: Автоматический расчёт таможенной стоимости (Invoice в EUR)
  // Работает только если выбрано "До 3 лет"
  useEffect(() => {
    if (ageCategory === "under3" && auctionPrice && currentRates) {
      // 1. Считаем сборы аукциона
      const fees = calcAuctionFees(auctionPrice, selectedAuction);
      // 2. Инвойс в долларах = ставка + сборы
      const invoiceUsd = auctionPrice + fees;
      // 3. Переводим в евро (EUR = USD / eurToUsd)
      const invoiceEur = invoiceUsd / currentRates.eurToUsd;
      // 4. Округляем до целого и записываем в форму
      setValue("customsValueEur", Math.round(invoiceEur));
    }
  }, [ageCategory, auctionPrice, selectedAuction, currentRates, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rates: rates ?? data.rates }),
      });
      const json = await res.json();
      if (res.ok) onResult(json);
      else console.error(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Блок 1: Аукцион */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Аукцион</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Сумма ставки (USD)</span>
            <input
              type="number"
              {...register("auctionPrice", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            <span className="text-xs text-gray-500 mt-1 block">
              Сборы аукциона будут рассчитаны автоматически.
            </span>
          </label>
          
          <label className="block">
            <span className="text-sm text-gray-700">Объём двигателя (см³)</span>
            <input
              type="number"
              {...register("engineVolumeCcm", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <div className="col-span-full mt-2">
            <span className="text-sm text-gray-700 block mb-2">Категория возраста</span>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="under3" {...register("ageCategory")} />
                <span className="text-sm">До 3 лет (непроходной)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="3to5" {...register("ageCategory")} />
                <span className="text-sm">От 3 до 5 лет (проходной)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="over5" {...register("ageCategory")} />
                <span className="text-sm">Старше 5 лет (непроходной)</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 2: Доставка */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Доставка</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Аукцион</span>
            <select {...register("auction")} className="mt-1 block w-full border rounded p-2">
              <option value="copart">Copart</option>
              <option value="iaai">IAAI</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Площадка</span>
            <select {...register("locationCode")} className="mt-1 block w-full border rounded p-2">
              {locations.map((loc) => (
                <option key={loc.code} value={loc.code}>{loc.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Порт назначения</span>
            <select {...register("port")} className="mt-1 block w-full border rounded p-2">
              <option value="klaipeda">Клайпеда</option>
              <option value="poti">Поти</option>
            </select>
          </label>
          
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 border-t pt-4">
            <label className="block">
              <span className="text-sm text-gray-700">До порта (США) (USD)</span>
              <input type="number" {...register("deliveryToPortUsd", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Морской фрахт (USD)</span>
              <input type="number" {...register("oceanFreightUsd", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">До Минска (USD)</span>
              <input type="number" {...register("deliveryToMinskUsd", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" />
            </label>
          </div>
        </div>
      </section>

      {/* Блок 3: Расстаможка */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Расстаможка</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Тип ТС</span>
            <select {...register("vehicleType")} className="mt-1 block w-full border rounded p-2">
              <option value="passenger">Легковой</option>
              <option value="moto">Мото</option>
              <option value="truck">Грузовой</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Тип двигателя</span>
            <select {...register("engineType")} className="mt-1 block w-full border rounded p-2">
              <option value="gasoline">Бензин</option>
              <option value="electric">Электро</option>
              <option value="hybrid">Гибрид</option>
            </select>
          </label>
          
          {/* ПОЛЕ ПОКАЗЫВАЕТСЯ ТОЛЬКО ДЛЯ АВТО ДО 3 ЛЕТ И НЕДОСТУПНО ДЛЯ ВВОДА */}
          {ageCategory === "under3" && (
            <label className="block col-span-full sm:col-span-1">
              <span className="text-sm text-gray-700">Таможенная стоимость (EUR) — Invoice</span>
              <input 
                type="number" 
                {...register("customsValueEur", { valueAsNumber: true })} 
                disabled 
                className="mt-1 block w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" 
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Рассчитывается автоматически (ставка + сборы аукциона)
              </span>
            </label>
          )}

          <label className="flex items-center gap-2 col-span-full mt-2">
            <input type="checkbox" {...register("isPrivileged")} />
            <span className="text-sm text-gray-700">Льготная растаможка (скидка 50% на пошлину)</span>
          </label>

          {isPrivileged && (
            <label className="block col-span-full sm:col-span-1">
              <span className="text-sm text-gray-700">Вознаграждение льготника (USD)</span>
              <input type="number" {...register("privilegedFeeUsd", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" placeholder="500" />
            </label>
          )}
        </div>
      </section>

      {/* Блок Оценки (только для авто до 3 лет) */}
      {ageCategory === "under3" && (
        <section className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4 text-blue-900">Оценка автомобиля</h2>
          <p className="text-sm text-blue-800 mb-4">Для автомобилей младше 3 лет обязательна процедура оценки.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Стоимость заключения (BYN)</span>
              <input type="number" {...register("conclusionCostByn", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Стоимость оценки (BYN)</span>
              <input type="number" {...register("evaluationCostByn", { valueAsNumber: true })} className="mt-1 block w-full border rounded p-2" />
            </label>
          </div>
        </section>
      )}

      {/* Блок 4: Документы */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Оформление документов</h2>
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" {...register("docs.epts")} />
              ЭПТС
            </span>
            <span className="text-gray-500">80 BYN</span>
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" {...register("docs.registration")} />
              Постановка на учёт ГАИ
            </span>
            <span className="text-gray-500">150 BYN</span>
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" {...register("docs.deregistration")} />
              Снятие с учёта ГАИ
            </span>
            <span className="text-gray-500">80 BYN</span>
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" {...register("docs.svh")} />
              Услуги СВХ
            </span>
            <span className="text-gray-500">650 BYN</span>
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Расчёт…" : "Рассчитать"}
      </button>
    </form>
  );
}