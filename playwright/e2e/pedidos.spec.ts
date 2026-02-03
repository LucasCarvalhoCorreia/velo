import { test, expect } from '@playwright/test';
import { gerarCodigoPedido } from '../support/helpers';

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
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - text: ${order.number}
      - img
      - text: ${order.status}
      `);
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - text: ${order.number}
      - img
      - text: ${order.status}
      `);
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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

  })

  test('deve exibir mensagem quando o pedido nao é encontrado', async ({ page }) => {

    //Test Data
    const orderError = gerarCodigoPedido()

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderError);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })

});