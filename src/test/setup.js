import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect functionality with Jest DOM matchers
expect.extend(matchers);

// Automatically run cleanup after each test case (e.g., unmount components)
afterEach(() => {
  cleanup();
});
