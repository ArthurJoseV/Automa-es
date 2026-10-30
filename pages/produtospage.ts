import { Page, Locator } from "@playwright/test"

export class ProdutosPage {
    readonly page: Page;
    readonly seletor_ordenacao: Locator;
    readonly produtos: Locator;

    constructor(page: Page) {
        this.page = page
        this.seletor_ordenacao = page.getByRole('combobox')
        this.produtos = page.getByRole('article')
    }

    async ordenarMenorParaMaior() {
        await this.seletor_ordenacao.selectOption('lohi')
    }

    async obterPrecos(): Promise<number[]> {
        const itens = await this.produtos.all();
        return Promise.all(itens.map(async (item) => {
            const texto = await item.getByRole('heading', { level: 3 }).textContent()
            return parseFloat(texto?.replace('$', '') ?? '')
        }))
    }
}
