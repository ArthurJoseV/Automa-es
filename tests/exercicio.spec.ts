import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
    await page.goto("https://www.saucedemo.com/");
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

test.describe("Login", () => {

    // CT - 001
    test("login com credenciais válidas", async ({ page }) => {
        await login(page, 'standard_user', 'secret_sauce');
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await expect(page.getByText('Swag Labs')).toBeVisible();
    })

    //CT -002 

    test("Login com credenciais inválidas", async ({ page }) => {
        await login(page, 'standard_user', 'secret_sauces');
        await expect(page.locator('.error-message-container')).toBeVisible();
    })
})


test.describe("Carrinho", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'standard_user', 'secret_sauce');
    })

    // CT - 003

    test("adição de produtos ao carrinho", async ({ page }) => {
        await page.getByText("Add to cart").first().click();
        await expect(page.locator(".shopping_cart_badge").first()).toHaveText("1");
    })



    // CT - 004
    test("remoção de produto do carrinho", async ({ page }) => {
        await page.getByText("Add to cart").first().click();
        await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

        await page.getByText("Remove").first().click();
        await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
    })
})

async function ordenarPordutos(page: Page) {
    await page.getByRole("combobox").selectOption("lohi")
}

test.describe("produtos", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'standard_user', 'secret_sauce');
    })

    // CT - 005
    test("ordenação de produtos do menor para o maior", async ({ page }) => {
        await ordenarPordutos(page);
        const produtos = await page.getByRole("article").all();
        const precos = await Promise.all(produtos.map(async (produto) => {
            const precoTexto = await produto.getByRole("heading", { level: 3 }).textContent();
            return parseFloat(precoTexto?.replace("$", "") ?? "") || 0

        }))
        const precosOrdenados = [...precos].sort((a, b) => a - b);
        expect(precos).toEqual(precosOrdenados)


    });
})

