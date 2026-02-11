import { test, expect } from '@playwright/test';
import { gerarCodigoPedido } from '../support/helpers';
import { OrderLockupPage } from '../support/pages/OrderLockupPage';

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  });

  test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data
    //const order = 'VLO-MMTX2T';

    const order = {
      number: 'VLO-MMTX2T', 
      status: 'APROVADO',
      color: 'Midnight Black',
      interior: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'Lucas Correia',
        email: 'lucas.correia@keeggo.com',
      },
      payment: 'À Vista',
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - text: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: order.status})
      
      await expect(statusBadge).toHaveClass(/bg-green-100/)
      await expect(statusBadge).toHaveClass(/text-green-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    //Test Data
    //const order = 'VLO-LN7HYH';

    const order = {
      number: 'VLO-LN7HYH',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Marcelo Faria Limer',
        email: 'marcelo.faria@hotmail.com',
      },
      payment: 'À Vista',
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - text: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: order.status})
      
      await expect(statusBadge).toHaveClass(/bg-red-100/)
      await expect(statusBadge).toHaveClass(/text-red-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-x/)

  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    //Test Data
    //const order = 'VLO-LN7HYH';

    const order = {
      number: 'VLO-1DX8GK',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Mario Barbosa Lima',
        email: 'mario.blima@hotmail.com',
      },
      payment: 'À Vista',
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - text: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: order.status})
      
      await expect(statusBadge).toHaveClass(/bg-amber-100/)
      await expect(statusBadge).toHaveClass(/text-amber-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-clock/)

  })

  test('deve exibir mensagem quando o pedido nao é encontrado', async ({ page }) => {

    //Test Data
    const orderError = gerarCodigoPedido()

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(orderError);

    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })

});