import { test, expect } from '../support/fixtures'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
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

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
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

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
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

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = gerarCodigoPedido()
    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const invalidOrderCode = 'ABC123'
    await app.orderLookup.searchOrder(invalidOrderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app, page }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(button).toBeDisabled()
  })

})