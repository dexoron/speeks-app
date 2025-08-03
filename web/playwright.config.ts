import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* Запуск тестов последовательно в CI */
  fullyParallel: true,
  
  /* Отключение параллельного выполнения при ошибках */
  forbidOnly: !!process.env.CI,
  
  /* Повторные попытки только в CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Количество воркеров */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter для вывода результатов */
  reporter: 'html',
  
  /* Глобальные настройки для всех проектов */
  use: {
    /* Базовый URL вашего приложения */
    baseURL: 'http://localhost:3000', // Измените на ваш URL
    
    /* Сбор трейсов при неудачных тестах */
    trace: 'on-first-retry',
    
    /* Скриншоты при неудачах */
    screenshot: 'only-on-failure',
    
    /* Видеозапись при неудачах */
    video: 'retain-on-failure',
  },

  /* Конфигурация для разных браузеров */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    /* WebKit отключен для Linux */
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Тестирование на мобильных устройствах */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Запуск локального сервера перед тестами */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});