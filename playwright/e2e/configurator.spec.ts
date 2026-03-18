import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('CT03 - deve atualizar o preço ao adicionar opcionais e navegar para o checkout com os valores corretos', async ({ app }) => {
    // Estado inicial sem opcionais
    await app.configurator.expectPrice('R$ 40.000,00')

    // 1 - Adicionar Precision Park
    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.expectPrice('R$ 45.500,00')

    // 2 - Adicionar Flux Capacitor
    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.expectPrice('R$ 50.500,00')

    // 3 - Desmarcar os checkboxes dos opcionais
    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.expectPrice('R$ 45.000,00')
    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.expectPrice('R$ 40.000,00')

    // 4 - Ir para o checkout com a configuração atual
    await app.configurator.goToCheckout('R$ 40.000,00')
  })
})