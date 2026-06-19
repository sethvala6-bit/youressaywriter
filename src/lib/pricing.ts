import { PricingDetails, OrderFormData } from '@/types/order';

const BASE_PRICES: { [key: string]: number } = {
  'high-school': 10,
  'undergraduate': 12,
  'master': 15,
  'phd': 18,
};

export function calculatePrice(data: Partial<OrderFormData>): PricingDetails {
  const wordCount = data.wordCount || 250;
  const academicLevel = data.academicLevel || 'undergraduate';
  const basePrice = BASE_PRICES[academicLevel] || 12;
  const basePagePrice = basePrice * Math.ceil(wordCount / 250);

  // Writer preference multiplier
  let writerMultiplier = 1;
  if (data.preferences?.premiumWriter) writerMultiplier = 1.25;
  if (data.preferences?.top10) writerMultiplier = 1.3;

  // Calculate deadline urgency
  let urgencyMultiplier = 1;
  if (data.deadline) {
    const now = new Date();
    const deadline = new Date(data.deadline);
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline <= 24) urgencyMultiplier = 1.5;
    else if (hoursUntilDeadline <= 48) urgencyMultiplier = 1.3;
    else if (hoursUntilDeadline <= 72) urgencyMultiplier = 1.15;
  }

  // Additional services
  let additionalServices = 0;
  if (data.preferences?.proofreading) additionalServices += 2.55 * Math.ceil(wordCount / 250);
  if (data.preferences?.originalityReport) additionalServices += 29.99;
  if (data.preferences?.urgentAssignment) additionalServices += 9.99;

  const subtotal = basePagePrice * writerMultiplier * urgencyMultiplier + additionalServices;

  // Apply discount
  const discountPercent = data.preferences?.bestWriter ? 5 : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalPrice = subtotal - discountAmount;

  return {
    basePrice: basePagePrice,
    writerMultiplier,
    urgencyMultiplier,
    additionalServices,
    subtotal,
    discountPercent,
    discountAmount,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
}

export function validateDiscountCode(code: string): { valid: boolean; discount: number } {
  const codes: { [key: string]: number } = {
    FIRST5: 5,
    SAVE10: 10,
    STUDENT15: 15,
  };

  const discount = codes[code.toUpperCase()] || 0;
  return { valid: discount > 0, discount };
}
