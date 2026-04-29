import { describe, expect, it } from 'vitest';
import {
  calculateInstallment,
  calculateTotalPrice,
  formatPrice,
  type CarConfiguration,
} from './configuratorStore';

const baseConfig: CarConfiguration = {
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
};

describe('calculateTotalPrice', () => {
  it('returns base price when using default configuration', () => {
    expect(calculateTotalPrice(baseConfig)).toBe(40000);
  });

  it('adds sport wheels price', () => {
    const config: CarConfiguration = { ...baseConfig, wheelType: 'sport' };
    expect(calculateTotalPrice(config)).toBe(42000);
  });

  it('adds all optional feature prices', () => {
    const config: CarConfiguration = {
      ...baseConfig,
      optionals: ['precision-park', 'flux-capacitor'],
    };

    expect(calculateTotalPrice(config)).toBe(50500);
  });
});

describe('calculateInstallment', () => {
  it('calculates 12 monthly installments with compound interest', () => {
    expect(calculateInstallment(40000)).toBe(3782.38);
  });
});

describe('formatPrice', () => {
  it('formats number to BRL currency', () => {
    expect(formatPrice(40000)).toBe('R$\u00A040.000,00');
  });
});
