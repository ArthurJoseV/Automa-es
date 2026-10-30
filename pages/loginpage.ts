import { Page, Locator } from "@playwright/test"

export class LoginPage {
    readonly page: Page;
    readonly campo_usuario: Locator;
    readonly campo_senha: Locator;
    readonly botao_login: Locator;
    readonly tituloLoja: Locator;
    readonly mensagemErro: Locator;

    constructor(page: Page) {
        this.page = page
        this.campo_usuario = page.getByPlaceholder('Username')
        this.campo_senha = page.getByPlaceholder('Password')
        this.botao_login = page.getByRole('button', { name: 'Login' }) 
        this.tituloLoja = page.getByText('Swag Labs')
        this.mensagemErro = page.locator('.error-message-container')
    }

    async abrir() {
        await this.page.goto("https://www.saucedemo.com/")
    }

    async login (usuario: string, senha: string) {
        await this.campo_usuario.fill(usuario)
        await this.campo_senha.fill(senha)
        await this.botao_login.click()
    }
}
    
