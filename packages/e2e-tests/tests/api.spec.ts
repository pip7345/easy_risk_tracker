import { test, expect } from '@playwright/test';

test.describe('API Health and Redirects', () => {
  test('API root should return info', async ({ request }) => {
    const response = await request.get('http://localhost:3000/');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.name).toBe('Crypto Bros Platform API');
    expect(data.status).toBe('running');
  });

  test('API health check should work', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  test('/demo_full/ should redirect to frontend', async ({ request }) => {
    const response = await request.get('http://localhost:3000/demo_full/', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(301);
    const location = response.headers()['location'];
    expect(location).toMatch(/demo-full/);
  });

  test('/demo/ should redirect to frontend', async ({ request }) => {
    const response = await request.get('http://localhost:3000/demo/', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(301);
    const location = response.headers()['location'];
    expect(location).toMatch(/\/demo/);
  });

  test('/login should redirect to frontend', async ({ request }) => {
    const response = await request.get('http://localhost:3000/login', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(301);
    const location = response.headers()['location'];
    expect(location).toMatch(/\/login/);
  });
});
