import { Page, Locator } from "@playwright/test"

export class CarrinhoPage {
    readonly page: Page;
    readonly itens_carrinho: Locator;
    readonly botao_remover: Locator;
    readonly titulo_carrinho: Locator;

    constructor(page: Page) {
        this.page = page
        this.itens_carrinho = page.locator('[data-test="inventory-item"]')
        this.botao_remover = page.getByRole('button', { name: 'Remove' })
        this.titulo_carrinho = page.locator('[data-test="title"]')
    }

    async removerPrimeiroItem() {
        await this.botao_remover.first().click()
    }
}
