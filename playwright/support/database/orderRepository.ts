import { supabase } from './database'
import type { OrderDetails } from '../actions/orderLookupActions'
import crypto from 'crypto'

export function normalizeValue(value: string) {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export async function insertOrder(order: OrderDetails) {
  const data = {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.toLowerCase().replace(' ', '-'),
    wheel_type: order.wheels.replace(' Wheels', '').toLowerCase(),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: normalizeValue(order.payment),
    total_price: order.total_price,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
  }

  const { error } = await supabase.from('orders').insert(data)
  if (error) throw new Error(`insertOrder failed: ${error.message}`)
}

export async function deleteOrderByNumber(orderNumber: string) {
  const { error } = await supabase.from('orders').delete().eq('order_number', orderNumber)
  if (error) throw new Error(`deleteOrderByNumber failed: ${error.message}`)
}

export async function deleteOrderByEmail(orderEmail: string) {
  const { error } = await supabase.from('orders').delete().eq('customer_email', orderEmail)
  if (error) throw new Error(`deleteOrderByEmail failed: ${error.message}`)
}