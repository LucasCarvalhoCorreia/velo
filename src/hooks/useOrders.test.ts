import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createOrder, getOrderByNumber } from './useOrders';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('creates an order successfully and formats the return object', async () => {
      // Mock chain: from().insert().select().single()
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'test-id',
          order_number: 'VLO-123456',
          color: 'midnight-black',
          wheel_type: 'sport',
          optionals: ['precision-park'],
          customer_name: 'John Doe Silva',
          customer_email: 'john@example.com',
          customer_phone: '123456789',
          customer_cpf: '12345678900',
          payment_method: 'avista',
          total_price: 45000,
          status: 'EM_ANALISE',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const orderData = {
        configuration: {
          exteriorColor: 'midnight-black' as const,
          interiorColor: 'carbon-black' as const,
          wheelType: 'sport' as const,
          optionals: ['precision-park' as const],
        },
        totalPrice: 45000,
        customer: {
          name: 'John',
          surname: 'Doe Silva',
          email: 'john@example.com',
          phone: '123456789',
          cpf: '12345678900',
          store: 'Loja Centro',
        },
        paymentMethod: 'avista' as const,
        status: 'EM_ANALISE' as const,
      };

      const result = await createOrder(orderData);

      expect(result.error).toBeNull();
      expect(result.order).not.toBeNull();
      expect(result.order?.id).toBe('VLO-123456');
      expect(result.order?.customer.name).toBe('John');
      expect(result.order?.customer.surname).toBe('Doe Silva');
      expect(result.order?.customer.store).toBe('Loja Centro');
      expect(mockInsert).toHaveBeenCalled();
    });

    it('handles database error gracefully', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database constraint failed' },
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const orderData = {
        configuration: { exteriorColor: 'glacier-blue', interiorColor: 'deep-blue', wheelType: 'aero', optionals: [] } as any,
        totalPrice: 40000,
        customer: { name: 'A', surname: 'B', email: 'a@b.com', phone: '1', cpf: '1', store: 'C' },
        paymentMethod: 'avista' as any,
        status: 'EM_ANALISE' as any,
      };

      const result = await createOrder(orderData);

      expect(result.order).toBeNull();
      expect(result.error).toBe('Database constraint failed');
    });
  });

  describe('getOrderByNumber', () => {
    it('returns formatted order when found', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: {
          customer_name: 'Jane Doe',
          order_number: 'VLO-999',
          color: 'glacier-blue',
          wheel_type: 'aero',
          optionals: [],
          total_price: 40000,
          customer_email: 'jane@example.com',
          customer_cpf: '111',
          customer_phone: '222',
          payment_method: 'financiamento',
          status: 'APROVADO',
          created_at: '2023-01-01',
        },
        error: null,
      });
      const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      // Simulate messy input
      const result = await getOrderByNumber('vlo-999 ');

      expect(result.error).toBeNull();
      expect(result.order?.id).toBe('VLO-999');
      expect(result.order?.customer.name).toBe('Jane');
      expect(result.order?.customer.surname).toBe('Doe');
      expect(mockEq).toHaveBeenCalledWith('order_number', 'VLO-999');
    });
    
    it('returns null order without error if not found', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null, // supabase returns no data and no error on maybeSingle matching null
      });
      const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const result = await getOrderByNumber('NON-EXISTENT');
      
      expect(result.order).toBeNull();
      expect(result.error).toBeNull();
    });
  });
});
