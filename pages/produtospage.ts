import { Page, Locator } from "@playwright/test"

export class ProdutosPage {
    readonly page: Page;
    readonly tituloLoja: Locator;
    readonly seletor_ordenacao: Locator;
    readonly precos: Locator;
    readonly botao_adicionar: Locator;
    readonly botao_remover: Locator;
    readonly badge_carrinho: Locator;
    readonly link_carrinho: Locator;

    constructor(page: Page) {
        this.page = page
        this.tituloLoja = page.locator('[data-test="title"]')
        this.seletor_ordenacao = page.locator('[data-test="product-sort-container"]')
        this.precos = page.locator('[data-test="inventory-item-price"]')
        this.botao_adicionar = page.getByRole('button', { name: 'Add to cart' })
        this.botao_remover = page.getByRole('button', { name: 'Remove' })
        this.badge_carrinho = page.locator('[data-test="shopping-cart-badge"]')
        this.link_carrinho = page.locator('[data-test="shopping-cart-link"]')
    }

    async ordenarMenorParaMaior() {
        await this.seletor_ordenacao.selectOption('lohi')
    }

    async obterPrecos(): Promise<number[]> {
        const textos = await this.precos.allTextContents()
        return textos.map(texto => parseFloat(texto.replace('$', '')))
    }

    async adicionarPrimeiroProduto() {
        await this.botao_adicionar.first().click()
    }

    async removerPrimeiroProduto() {
        await this.botao_remover.first().click()
    }

    async irParaCarrinho() {
        await this.link_carrinho.click()
    }
}
