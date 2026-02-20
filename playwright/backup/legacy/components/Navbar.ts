import { Page } from '@playwright/test'

export class NavBar {
  constructor(private page: Page) {}

  async orderLockupLink() {
    await this.page.getByTestId('header-nav').getByRole('link', { name: 'Consultar Pedido' }).click()
    
  }
}

