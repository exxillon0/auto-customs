export const DOC_PRICES_BYN = {
  epts: 80,
  registration: 150,
  deregistration: 80,
  svh: 650,
};

export const RECYCLING_FEE_BYN = {
  under3: 624.92,
  over3: 1282.02,
};

export const CUSTOMS_FEE_BYN = 120;

// Автомобили до 3 лет
export const DUTY_RATES_UNDER3 = [
  { maxCost: 8500, percent: 54, minEurPerCcm: 2.5 },
  { maxCost: 16700, percent: 48, minEurPerCcm: 3.5 },
  { maxCost: 42300, percent: 48, minEurPerCcm: 5.5 },
  { maxCost: 84500, percent: 48, minEurPerCcm: 7.5 },
  { maxCost: 169000, percent: 48, minEurPerCcm: 15 },
  { maxCost: Infinity, percent: 48, minEurPerCcm: 20 },
];

// Автомобили от 3 до 5 лет
export const DUTY_RATES_3_TO_5 = [
  { maxCcm: 1000, eurPerCcm: 1.5 },
  { maxCcm: 1500, eurPerCcm: 1.7 },
  { maxCcm: 1800, eurPerCcm: 2.5 },
  { maxCcm: 2300, eurPerCcm: 2.7 },
  { maxCcm: 3000, eurPerCcm: 3.0 },
  { maxCcm: Infinity, eurPerCcm: 3.6 },
];

// Автомобили старше 5 лет
export const DUTY_RATES_OVER5 = [
  { maxCcm: 1000, eurPerCcm: 3.0 },
  { maxCcm: 1500, eurPerCcm: 3.2 },
  { maxCcm: 1800, eurPerCcm: 3.5 },
  { maxCcm: 2300, eurPerCcm: 4.8 },
  { maxCcm: 3000, eurPerCcm: 5.0 },
  { maxCcm: Infinity, eurPerCcm: 5.7 },
];

export const FIXED_BUTTON_FEE_USD = 500;