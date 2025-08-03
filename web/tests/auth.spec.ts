import { test, expect } from '@playwright/test';

test.describe('Тесты авторизации', () => {
  test('успешная авторизация с валидными данными', async ({ page }) => {
    // Переход на страницу авторизации
    await page.goto('/auth/login');

    // Заполнение формы авторизации
    await page.fill('input[name="login"]', 'dexoron2');
    await page.fill('input[name="password"]', '13553155');

    // Нажатие кнопки входа
    await page.click('button[type="submit"]');
    // Альтернативный вариант, если кнопка имеет текст:
    // await page.getByRole('button', { name: 'Войти' }).click();

    // Ожидание перенаправления после успешного входа
    await page.waitForURL('**/dashboard'); // или другая страница после входа
    
    // Проверка успешной авторизации
    await expect(page).toHaveURL(/dashboard/); // или другой паттерн URL
    
    // Дополнительные проверки (опционально)
    // await expect(page.getByText('Добро пожаловать')).toBeVisible();
    // await expect(page.getByText('dexoron2')).toBeVisible();
  });

  test('авторизация с неверными данными', async ({ page }) => {
    await page.goto('/auth/login');

    // Попытка входа с неверными данными
    await page.fill('input[name="login"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Проверка сообщения об ошибке
    await expect(page.getByText(/неверный логин или пароль/i)).toBeVisible();
    
    // Проверка, что остались на странице авторизации
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('авторизация с пустыми полями', async ({ page }) => {
    await page.goto('/auth/login');

    // Попытка входа без заполнения полей
    await page.click('button[type="submit"]');

    // Проверка валидации формы
    await expect(page.locator('input[name="login"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
  });

  test('проверка элементов формы авторизации', async ({ page }) => {
    await page.goto('/auth/login');

    // Проверка наличия основных элементов
    await expect(page.locator('input[name="login"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Проверка placeholder'ов (если есть)
    await expect(page.locator('input[name="login"]')).toHaveAttribute('placeholder', /логин|login/i);
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });
});