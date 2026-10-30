import { expect, test } from "@playwright/test";
import { CarrinhoPage } from "../pages/carrinhopage";
import { LoginPage } from "../pages/loginpage";
import { ProdutosPage } from "../pages/produtospage";

test.describe("Login", () => {
    test("CT-001: login com credenciais válidas", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauce");

        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await expect(loginPage.tituloLoja).toBeVisible();
    });

    test("CT-002: login com credenciais inválidas", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauces");

        await expect(loginPage.mensagemErro).toBeVisible();
    });
});

test.describe("Carrinho", () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.abrir();
        await loginPage.login("standard_user", "secret_sauce");
    });

    test("CT-003: adição de produto ao carrinho", async ({ page }) => {
        const carrinhoPage = new CarrinhoPage(page);
        await carrinhoPage.adicionarPrimeiroProduto();

        await expect(carrinhoPage.badge_carrinho).toHaveText('1');
    });

    test("CT-004: remoção de produto do carrinho", async ({ page }) => {
        const carrinhoPage = new CarrinhoPage(page);
        await carrinhoPage.adicionarPrimeiroProduto();
        await expect(carrinhoPage.badge_carrinho).toHaveText('1');

        await carrinhoPage.removerPrimeiroProduto();
        await expect(carrinhoPage.badge_carrinho).toHaveCount(0);
    });
});

test("CT-005: ordenação de produtos do menor para o maior", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.abrir();
    await loginPage.login("standard_user", "secret_sauce");

    const produtosPage = new ProdutosPage(page);
    await produtosPage.ordenarMenorParaMaior();

    const precos = await produtosPage.obterPrecos();
    expect(precos).toEqual([...precos].sort((a, b) => a - b));
});
