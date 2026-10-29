"use client";

import { useState } from "react";

const methodologies = [
  {
    title: "Таможенная пошлина — физ. лицо (ЕЭК)",
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Размер пошлины зависит от возраста автомобиля, объёма двигателя и его таможенной стоимости.</p>
        
        <div>
          <strong className="text-gray-900">Автомобили до 3 лет (непроходные):</strong>
          <p>Рассчитывается по формуле: <code>MAX (% от стоимости в EUR, ставка за 1 см³ × объём двигателя)</code>. Мы автоматически выбираем наибольшее значение.</p>
        </div>

        <div>
          <strong className="text-gray-900">Автомобили от 3 до 5 лет (проходные):</strong>
          <p>Рассчитывается по фиксированной ставке в евро за 1 см³ объёма двигателя. Процент от стоимости не применяется.</p>
        </div>

        <div>
          <strong className="text-gray-900">Автомобили старше 5 лет (непроходные):</strong>
          <p>Также рассчитывается по фиксированной ставке в евро за 1 см³, но ставки значительно выше, чем для категории 3–5 лет.</p>
        </div>

        <div>
          <strong className="text-gray-900">Электромобили:</strong>
          <p>Пошлина составляет 15% от таможенной стоимости. Для электромобилей старше 5 лет дополнительно начисляется НДС 20%.</p>
        </div>

        <div>
          <strong className="text-gray-900">Льготная растаможка (Указ №140):</strong>
          <p>При наличии льготы предоставляется скидка 50% на рассчитанную таможенную пошлину. (Не применяется для гибридов).</p>
        </div>
      </div>
    ),
  },
  {
    title: "Утилизационный сбор",
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Утильсбор — это обязательный фиксированный платёж за утилизацию автомобиля в будущем. Для физических лиц сумма зависит только от возраста ТС.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Для автомобилей <strong>младше 3 лет</strong>: 624,92 BYN (базовая ставка).</li>
          <li>Для автомобилей <strong>старше 3 лет</strong>: 1 282,02 BYN (базовая ставка).</li>
        </ul>
        <p className="text-xs text-gray-500 italic mt-2">* Итоговая сумма в долларах рассчитывается по текущему курсу НБРБ.</p>
      </div>
    ),
  },
  {
    title: "Таможенный сбор",
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Это фиксированная плата за оформление документов сотрудниками таможни. Для физических лиц она составляет <strong>120 BYN</strong>.</p>
        <p>В калькуляторе эта сумма автоматически переводится в доллары по актуальному курсу.</p>
      </div>
    ),
  },
  {
    title: "Расходы на СВХ (склад временного хранения)",
    content: (
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>После прибытия автомобиля в порт (Клайпеда или Поти), он помещается на Склад Временного Хранения (СВХ) до момента подачи декларации и выпуска таможней.</p>
        <p>Стоимость хранения зависит от тарифов конкретного терминала и количества дней. Обычно это фиксированная ставка за сутки. 
            На текущий момент в калькуляторе эта сумма не выделена отдельной строкой, а может быть включена в этап "Доставка до Минска" или оплачивается отдельно логистической компании. 
            </p>
            <p>Средняя стоимость услуг хранения (стоянка,нахождение эвакуатора на территории СВХ и т.д.) - 650 BYN</p>
      </div>
    ),
  },
];

export function MethodologyBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-12 space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Методология расчёта</h2>
      
      {methodologies.map((item, index) => {
        const isOpen = openIndex === index;
        
        return (
          <div 
            key={index} 
            className={`border rounded-xl transition-all duration-200 ${
              isOpen ? "border-blue-300 shadow-sm" : "border-blue-100 bg-white hover:border-blue-200"
            }`}
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                {/* Иконка Плюс/Минус */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                }`}>
                  {isOpen ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  )}
                </div>
                
                <span className="font-medium text-gray-900 text-base">{item.title}</span>
              </div>

              {/* Иконка Стрелки */}
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Контент */}
            {isOpen && (
              <div className="px-5 pb-6 pt-2 pl-[4.5rem]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}