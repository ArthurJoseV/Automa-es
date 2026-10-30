import { Page, Locator } from "@playwright/test"

export class CarrinhoPage {
    readonly page: Page;
    readonly botao_adicionar: Locator;
    readonly botao_remover: Locator;
    readonly badge_carrinho: Locator;

    constructor(page: Page) {
        this.page = page
        this.botao_adicionar = page.getByText('Add to cart')
        this.botao_remover = page.getByText('Remove')
        this.badge_carrinho = page.locator('.shopping_cart_badge')
    }

    async adicionarPrimeiroProduto() {
        await this.botao_adicionar.first().click()
    }

    async removerPrimeiroProduto() {
        await this.botao_remover.first().click()
    }
}
