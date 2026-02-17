import { Page, expect } from '@playwright/test'

export class LandingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5173/')
    await expect(this.page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  }
}

