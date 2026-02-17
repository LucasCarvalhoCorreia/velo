import { test, expect } from '@playwright/test'

import { gerarCodigoPedido } from '../support/helpers'

import { NavBar } from '../support/components/Navbar'

import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    // Arrange
    await new LandingPage(page).goto()
    await new NavBar(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    orderLockupPage.validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-MMTX2T', 
      status: 'APROVADO' as const,
      color: 'Midnight Black',
      interior: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'Lucas Correia',
        email: 'lucas.correia@keeggo.com',
      },
      payment: 'À Vista',
    }

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-LN7HYH',
      status: 'REPROVADO' as const,
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Marcelo Faria Limer',
        email: 'marcelo.faria@hotmail.com',
      },
      payment: 'À Vista',
    }

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    const order: OrderDetails = {
      number: 'VLO-1DX8GK',
      status: 'EM_ANALISE' as const,
      color: 'Lunar White',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Mario Barbosa Lima',
        email: 'mario.blima@hotmail.com',
      },
      payment: 'À Vista',
    }

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()
    await orderLockupPage.searchOrder(order)
    await orderLockupPage.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {
    const invalidOrderCode = 'ABC123'
    await orderLockupPage.searchOrder(invalidOrderCode)
    await orderLockupPage.validateOrderNotFound()
  })
})