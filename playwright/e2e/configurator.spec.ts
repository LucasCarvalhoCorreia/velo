import { test, expect } from '@playwright/test';

/**
 * CT02 - Validação do Configurador do Veículo
 * Separado em cenários focados em funcionalidades específicas (Cor vs Rodas).
 */
test.describe('Configurador', () => {
  // O beforeEach garante que a navegação até o configurador seja feita antes de cada teste
  test.beforeEach(async ({ page }) => {
    // Arrange: acessar a página inicial e em seguida o configurador
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/configure');
    await expect(page).toHaveURL(/\/configure/);

    // Checkpoint: estado inicial da página do configurador
    await expect(
      page.getByRole('heading', { name: 'Velô Sprint', level: 1 })
    ).toBeVisible();
  });

  test('deve validar a seleção e troca de cor do veículo', async ({ page }) => {
    // 1. Valida a cor que vem selecionada de fábrica
    await expect(
      page.getByRole('heading', { name: 'Cor', level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Glacier Blue' })
    ).toBeVisible();

    // Valida o preço base inicial e imagem correspondente à cor
    await expect(page.getByText('Preço de Venda')).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
    await expect(page.getByTestId('car-exterior-image')).toHaveAttribute('src', /glacier-blue.*aero/);

    // 2. Realiza a troca da cor para Midnight Black
    await page.getByRole('button', { name: 'Midnight Black' }).click();

    // 3. Valida se a cor mudou mantendo o valor do carro, e se a imagem atualizou
    await expect(
      page.getByRole('button', { name: 'Midnight Black' })
    ).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
    await expect(page.getByTestId('car-exterior-image')).toHaveAttribute('src', /midnight-black.*aero/);
  });

  test('deve validar a seleção e troca de rodas do veículo', async ({ page }) => {
    // 1. Valida as rodas que vêm selecionadas de fábrica
    await expect(
      page.getByRole('heading', { name: 'Rodas', level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Aero Wheels.*Incluso/ })
    ).toBeVisible();

    // Valida o preço base inicial e imagem correspondente à roda
    await expect(page.getByText('Preço de Venda')).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
    await expect(page.getByTestId('car-exterior-image')).toHaveAttribute('src', /glacier-blue.*aero/);

    // 2. Realiza a troca da roda para Sport Wheels
    // O texto no botão será algo como "Sport Wheels + R$ 2.000,00"
    await page.getByRole('button', { name: /Sport Wheels/ }).click();

    // 3. Valida se a alteração de roda refletiu corretamente no preço e na imagem
    await expect(page.getByText('R$ 42.000,00')).toBeVisible();
    await expect(page.getByTestId('car-exterior-image')).toHaveAttribute('src', /glacier-blue.*sport/);
  });
});
