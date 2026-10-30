import { expect, test } from "@playwright/test";
import { CarrinhoPage } from "../pages/carrinhopage";
import { LoginPage } from "../pages/loginpage";
import { ProdutosPage } from "../pages/produtospage";

test.describe("Login", () => {
    test("CT-001: login com credenciais válidas", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauce");

        const produtosPage = new ProdutosPage(page);
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(produtosPage.tituloLoja).toBeVisible();
        await expect(produtosPage.tituloLoja).toHaveText("Products");
    });

    test("CT-002: login com credenciais inválidas", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "senha_errada");

        await expect(loginPage.mensagemErro).toBeVisible();
        await expect(loginPage.mensagemErro).toContainText(
            "Username and password do not match any user in this service"
        );
    });
});

test.describe("Carrinho", () => {
    let produtosPage: ProdutosPage;
    let carrinhoPage: CarrinhoPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauce");

        produtosPage = new ProdutosPage(page);
        carrinhoPage = new CarrinhoPage(page);
    });

    test("CT-003: adição de produto ao carrinho", async ({ page }) => {
        await produtosPage.adicionarPrimeiroProduto();
        await expect(produtosPage.badge_carrinho).toHaveText("1");

        // Navega ao carrinho e confirma que o item realmente está lá
        await produtosPage.irParaCarrinho();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(carrinhoPage.itens_carrinho).toHaveCount(1);
    });

    test("CT-004: remoção de produto do carrinho", async ({ page }) => {
        await produtosPage.adicionarPrimeiroProduto();
        await expect(produtosPage.badge_carrinho).toHaveText("1");

        // Navega ao carrinho e remove o item
        await produtosPage.irParaCarrinho();
        await expect(carrinhoPage.itens_carrinho).toHaveCount(1);

        await carrinhoPage.removerPrimeiroItem();
        await expect(carrinhoPage.itens_carrinho).toHaveCount(0);
        await expect(produtosPage.badge_carrinho).toHaveCount(0);
    });
});

test.describe("Produtos", () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauce");
    });

    test("CT-005: ordenação de produtos do menor para o maior preço", async ({ page }) => {
        const produtosPage = new ProdutosPage(page);
        await produtosPage.ordenarMenorParaMaior();

        const precos = await produtosPage.obterPrecos();

        // Garante que obtivemos preços válidos (não NaN)
        expect(precos.length).toBeGreaterThan(0);
        precos.forEach(preco => expect(preco).not.toBeNaN());

        // Compara com a mesma lista ordenada
        const precosOrdenados = [...precos].sort((a, b) => a - b);
        expect(precos).toEqual(precosOrdenados);
    });
});
