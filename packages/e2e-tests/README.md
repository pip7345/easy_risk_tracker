# End-to-End Testing with Playwright

This package contains E2E tests for the Crypto Bros Platform.

## Setup

```bash
# Install dependencies (from root)
npm install

# Install Playwright browsers
cd packages/e2e-tests
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report

# Generate test code (record interactions)
npm run test:codegen
```

## Test Coverage

### API Tests (`api.spec.ts`)
- ✅ API root endpoint returns info
- ✅ Health check endpoint works
- ✅ Legacy route redirects (`/demo_full/`, `/demo/`, `/login`)

### Frontend Tests (`frontend.spec.ts`)
- ✅ Home page loads with all content
- ✅ All page links are visible
- ✅ Demo page loads correctly
- ✅ Demo-full page loads correctly
- ✅ Login page loads correctly
- ✅ 404 page shows for invalid routes

### Navigation Tests (`navigation.spec.ts`)
- ✅ Navigate from home to demo
- ✅ Navigate from home to demo-full
- ✅ 404 page home link works
- ✅ Browser back button works

### Form Tests (`forms.spec.ts`)
- ✅ Demo page form is functional
- ✅ Login form has all fields
- ✅ Sample data button navigates correctly
- ✅ Form inputs accept text

## Test Configuration

Tests are configured to:
- Start both API (port 3000) and Web (port 5173) servers automatically
- Reuse existing servers if already running
- Run in Chrome by default
- Capture traces on first retry for debugging
- Generate HTML reports

## CI/CD

Tests can be run in CI environments. Set `CI=true` to enable:
- No server reuse
- 2 retries on failure
- Single worker (sequential tests)

## Writing New Tests

Create new test files in `tests/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('my new test', async ({ page }) => {
  await page.goto('/my-route');
  await expect(page.locator('h1')).toContainText('Expected Text');
});
```

## Debugging

Use the UI mode for interactive debugging:
```bash
npm run test:ui
```

Or use debug mode to step through tests:
```bash
npm run test:debug
```
