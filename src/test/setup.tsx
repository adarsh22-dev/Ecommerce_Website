import "@testing-library/jest-dom/vitest";
import React from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement("img", { src, alt, ...props });
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("div", props, children),
    span: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("span", props, children),
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("button", props, children),
    a: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("a", props, children),
    p: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("p", props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const icon = (props: Record<string, unknown>) => React.createElement("svg", { "data-testid": "mock-icon", ...props });
  return {
    Search: icon,
    ShoppingBag: icon,
    User: icon,
    Menu: icon,
    X: icon,
    Heart: icon,
    MessageSquare: icon,
    Send: icon,
    Sparkles: icon,
    Bot: icon,
    Package: icon,
    LayoutDashboard: icon,
    ShoppingCart: icon,
    Users: icon,
    Tag: icon,
    Settings: icon,
    BarChart3: icon,
    Image: icon,
    ChevronLeft: icon,
    Globe: icon,
    FileText: icon,
    ChevronDown: icon,
    Star: icon,
    Plus: icon,
    Minus: icon,
    Trash2: icon,
    AlertCircle: icon,
    Check: icon,
    ArrowLeft: icon,
    ArrowRight: icon,
    Home: icon,
    Mail: icon,
    Phone: icon,
    MapPin: icon,
    CreditCard: icon,
    Truck: icon,
    Clock: icon,
    Shield: icon,
    Gift: icon,
    Percent: icon,
    Copy: icon,
    ExternalLink: icon,
    Eye: icon,
    EyeOff: icon,
    Loader2: icon,
    LogOut: icon,
    MenuIcon: icon,
  };
});
