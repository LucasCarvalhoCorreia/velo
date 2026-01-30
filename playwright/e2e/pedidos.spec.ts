import { test, expect } from '@playwright/test';

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-MMTX2T');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  await expect(page.getByText('PedidoVLO-MMTX2T')).toBeVisible();
  await expect(page.getByTestId('order-result-VLO-MMTX2T')).toContainText('PedidoVLO-MMTX2T');

  await expect(page.getByText('APROVADO')).toBeVisible();
  await expect(page.getByTestId('order-result-VLO-MMTX2T')).toContainText('APROVADO');
})