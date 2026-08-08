import "@testing-library/jest-dom";
import { vi } from "vitest";

// ponytail: framer-motion `whileInView` and Next.js `Image` need IntersectionObserver in jsdom.
// Real observer behavior is not under test; class mock avoids ReferenceError.
class MockIntersectionObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}
window.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
