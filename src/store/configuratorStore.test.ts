import { describe, expect, it, beforeEach } from 'vitest';
import {
  calculateInstallment,
  calculateTotalPrice,
  formatPrice,
  useConfiguratorStore,
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

describe('useConfiguratorStore', () => {
  beforeEach(() => {
    useConfiguratorStore.setState({
      configuration: {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: [],
      },
      orders: [],
      currentUserEmail: null,
    });
  });

  it('toggles an optional feature by adding it if not present', () => {
    const { toggleOptional } = useConfiguratorStore.getState();
    toggleOptional('precision-park');
    
    expect(useConfiguratorStore.getState().configuration.optionals).toContain('precision-park');
  });

  it('toggles an optional feature by removing it if already present', () => {
    const { toggleOptional } = useConfiguratorStore.getState();
    toggleOptional('flux-capacitor');
    expect(useConfiguratorStore.getState().configuration.optionals).toContain('flux-capacitor');
    
    toggleOptional('flux-capacitor');
    expect(useConfiguratorStore.getState().configuration.optionals).not.toContain('flux-capacitor');
  });

  it('handles login matching an existing order', () => {
    // using baseConfig defined globally in the file
    useConfiguratorStore.setState({
      orders: [
        {
          id: '1',
          configuration: { exteriorColor: 'glacier-blue', interiorColor: 'carbon-black', wheelType: 'aero', optionals: [] },
          totalPrice: 40000,
          customer: { name: 'Test', surname: 'User', email: 'test@example.com', phone: '', cpf: '', store: '' },
          paymentMethod: 'avista',
          status: 'APROVADO',
          createdAt: '2023-01-01'
        }
      ]
    });

    const { login, getUserOrders } = useConfiguratorStore.getState();
    
    // Login with valid email
    const success = login('test@example.com');
    expect(success).toBe(true);
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('test@example.com');
    
    // Check their orders
    const orders = getUserOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0].customer.email).toBe('test@example.com');
  });

  it('declines login for email without orders', () => {
    const { login } = useConfiguratorStore.getState();
    
    const success = login('unknown@example.com');
    expect(success).toBe(false);
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
  });
});
