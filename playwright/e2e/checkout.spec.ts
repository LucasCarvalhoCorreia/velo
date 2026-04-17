import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout - Validação de Campos Obrigatórios e Dados Inválidos', () => {
  test.beforeEach(async ({ page, app }) => {
    await page.goto('/order')
    await expect(page.getByTestId('checkout-submit')).toBeVisible()

    alerts = app.checkout.elements.alerts
  })
  
  let alerts: any

  test('CT04.1: deve exibir erros de obrigatoriedade ao deixar todos os campos em branco', async ({ app }) => {
    // Act
    await app.checkout.submit()

    // Assert: Valida todas as mensagens de erro sob os campos vazios
    await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(alerts.lastName).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(alerts.email).toHaveText('Email inválido')
    await expect(alerts.phone).toHaveText('Telefone inválido')
    await expect(alerts.document).toHaveText('Documento inválido')
    await expect(alerts.store).toHaveText('Selecione uma loja')
    await expect(alerts.terms).toHaveText('Aceite os termos')
  })

  test('CT04.2: deve exibir erro de comprimento mínimo para Nome e Sobrenome', async ({ app }) => {
    const customer = {
      name: 'a',
      lastName: 'a',
      email: 'cliente@teste.com',
      phone: '11999999999',
      document: '12345678909'
    }
    
    // Arrange
    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore('Velô Paulista - Av. Paulista, 1000')

    // Act
    await app.checkout.submit()
    
    // Assert
    await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(alerts.lastName).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
  })

  test('CT04.3: deve exibir erro de e-mail com formato inválido', async ({ app }) => {
    const customer = {
      name: 'Lucas',
      lastName: 'Silva',
      email: 'cliente@.com',
      phone: '11999999999',
      document: '12345678909'
    }
    
    // Arrange
    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore('Velô Paulista - Av. Paulista, 1000')

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.email).toHaveText('Email inválido')
  })

  test('CT04.4: deve exibir erro para CPF incompleto ou inválido', async ({ app }) => {
    const customer = {
      name: 'Lucas',
      lastName: 'Silva',
      email: 'lucas.silva@teste.com',
      phone: '11999999999',
      document: '1234567890'
    }
    
    // Arrange
    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore('Velô Paulista - Av. Paulista, 1000')

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.document).toHaveText('Documento inválido')
  })

  test('CT04.5: deve exigir o aceite dos termos após preencher demais dados corretamente', async ({ app }) => {
    const customer = {
      name: 'Lucas',
      lastName: 'Silva',
      email: 'lucas.silva@teste.com',
      phone: '11999999999',
      document: '12345678909'
    }
    
    // Arrange
    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore('Velô Paulista - Av. Paulista, 1000')

    // Act
    await app.checkout.submit()

    // Assert: Formulario não avança e mostra erro dos termos
    await expect(app.checkout.elements.terms).not.toBeChecked()
    await expect(alerts.terms).toHaveText('Aceite os termos')
  })
})

test.describe('Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Configure Agora/i }).click()
  })

  test('CT05 - deve criar um pedido com sucesso para pagamento à vista', async ({ page, app }) => {

    const customer = {
      name: 'Lucas',
      lastName: 'Carvalho',
      email: 'lucas@teste.com',
      phone: '(11) 99999-9999',
      document: '05366127068',
      store: 'Velô Paulista',
      paymentMethod: 'À Vista',
      totalPrice: 'R$ 40.000,00'
    }

    await deleteOrderByEmail(customer.email)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.expectSummaryTotal(customer.totalPrice)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Pedido Aprovado!')
  })

  test('CT06 - deve aprovar automaticamente o crédito quando o score do cpf for maior que 700 no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'Marta',
      lastName: 'Nunes',
      email: 'marta.nunes@teste.com',
      phone: '(11) 99999-9999',
      document: '12345678909',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(750)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Pedido Aprovado!')
  })

  test('CT07 - deve ficar em análise quando o score do cpf estiver entre 500 e 700 no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'João',
      lastName: 'Silva',
      email: 'joao.silva@teste.com',
      phone: '(11) 99999-9999',
      document: '30927188015',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(502)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Crédito em Análise!')
  })

  test('CT08 - deve reprovar o crédito quando o score do cpf for menor que 500 no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'João',
      lastName: 'Silva',
      email: 'joao.silva@teste.com',
      phone: '(11) 99999-9999',
      document: '30927188024',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(500)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Crédito Reprovado')
  })

  test('CT08.1 - deve reprovar o crédito quando o score do cpf for menor que 500 e com entrada menor que 50% no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'João',
      lastName: 'Silva',
      email: 'joao.silva@teste.com',
      phone: '(11) 99999-9999',
      document: '30927188031',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00',
      downPayment: '10000'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(500)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.fillDownPayment('10000')
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Crédito Reprovado')
  })

  test('CT08.2 - deve aprovar o crédito quando o score do cpf for menor que 500 e com entrada igual a 50% no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'Marilene',
      lastName: 'Rosa',
      email: 'marilene.rosa@teste.com',
      phone: '(11) 99999-9999',
      document: '93913013393',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00',
      downPayment: '20000'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(420)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.fillDownPayment('20000')
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Pedido Aprovado!')
  })

  test('CT09 - deve aprovar o crédito quando o score do cpf for menor que 500 e com entrada maior que 50% no financiamento.', async ({ page, app }) => {
    const customer = {  
      name: 'Carla ',
      lastName: 'Nunes',
      email: 'carla.nunes@teste.com',
      phone: '(11) 99999-9999',
      document: '28373710175',
      store: 'Velô Paulista',
      paymentMethod: 'Financiamento',
      totalPrice: 'R$ 40.000,00',
      downPayment: '25000'
    }

    await deleteOrderByEmail(customer.email)

    await app.checkout.mockCreditAnalysis(300)

    await app.configurator.expectPrice(customer.totalPrice)
    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()

    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectStore(customer.store)

    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await app.checkout.fillDownPayment('25000')
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    await app.checkout.statusValidation('Pedido Aprovado!')
  })
})