
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Globe,
  UserRound,
  ShoppingCart,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Package,
  Heart,
  LogIn,
  UserPlus,
  Check,
} from "lucide-react";
import { languages, translations } from "../lib/i18n";
type SiteHeaderProps = {
  cartCount?: number;
  userName?: string | null;
  onSearch?: (query: string) => void;
};

const categories = [
  {
    name: "Electronics",
    items: ["Mobiles", "Laptops", "Headphones", "Smart watches"],
  },
  {
    name: "Fashion",
    items: ["Men", "Women", "Footwear", "Accessories"],
  },
  {
    name: "Home & Kitchen",
    items: ["Kitchen tools", "Home decor", "Furniture", "Bedding"],
  },
  {
    name: "Beauty & Personal Care",
    items: ["Skin care", "Hair care", "Fragrance", "Wellness"],
  },
];

export default function SiteHeader({
  cartCount = 0,
  userName = null,
  onSearch,
}: SiteHeaderProps) {
  const [languageCode, setLanguageCode] = useState("en");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const languageRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const language =
    languages.find((item) => item.code === languageCode) ?? languages[0];

  // Full translations are currently provided for English, Hindi,
  // Telugu, Tamil and Bengali. Other languages temporarily use English.
  const t =
    translations[
      languageCode as keyof typeof translations
    ] ?? translations.en;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("indkart-language");
    const savedTheme = localStorage.getItem("indkart-theme");

    if (
      savedLanguage &&
      languages.some((item) => item.code === savedLanguage)
    ) {
      setLanguageCode(savedLanguage);
      applyLanguage(savedLanguage);
    } else {
      applyLanguage("en");
    }

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      const target = event.target as Node;

      if (!languageRef.current?.contains(target)) setLanguageOpen(false);
      if (!accountRef.current?.contains(target)) setAccountOpen(false);
      if (!categoryRef.current?.contains(target)) setCategoryOpen(false);
    }

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  function applyLanguage(code: string) {
    const selected = languages.find((item) => item.code === code);
    if (!selected) return;

    document.documentElement.lang = code;
    document.documentElement.dir = selected.dir;

    // The font name is applied here; font files are loaded separately.
    document.documentElement.style.fontFamily =
      `"${selected.font}", Arial, sans-serif`;
  }

  function selectLanguage(code: string) {
    if (!languages.some((item) => item.code === code)) return;

    setLanguageCode(code);
    localStorage.setItem("indkart-language", code);
    applyLanguage(code);
    setLanguageOpen(false);
    setLanguageSearch("");
  }

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("indkart-theme", nextDark ? "dark" : "light");
  }

  const filteredLanguages = languages.filter((item) =>
    `${item.name} ${item.native} ${item.code}`
      .toLowerCase()
      .includes(languageSearch.toLowerCase()),
  );

  function categoryUrl(name: string) {
    return `/category/${encodeURIComponent(
      name.toLowerCase().replaceAll(" ", "-"),
    )}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-2 text-center text-xs text-[var(--text-secondary)] sm:text-sm">
        {t.announcement}
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <a
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="IndKart home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <ShoppingCart size={24} strokeWidth={1.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Ind<span className="text-[var(--primary)]">Kart</span>
          </span>
        </a>

        <form
          className="hidden min-w-0 flex-1 md:block"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.(search);
          }}
        >
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 focus-within:border-[var(--primary)]">
            <Search
              size={24}
              strokeWidth={1.5}
              className="shrink-0 text-[var(--text-secondary)]"
            />
            <input
              aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Submit search">
              <Search
                size={24}
                strokeWidth={1.5}
                className="text-[var(--primary)]"
              />
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Language picker */}
          <div className="relative" ref={languageRef}>
            <button
              type="button"
              className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm hover:bg-[var(--background)] sm:gap-2 sm:px-3"
              aria-haspopup="listbox"
              aria-expanded={languageOpen}
              onClick={() => {
                setLanguageOpen(!languageOpen);
                setAccountOpen(false);
                setCategoryOpen(false);
              }}
            >
              <Globe size={24} strokeWidth={1.5} />
              <span className="max-w-16 truncate sm:max-w-24">
                {language.native}
              </span>
              <ChevronDown size={16} strokeWidth={1.5} />
            </button>

            {languageOpen && (
              <div className="absolute end-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                <div className="border-b border-[var(--border)] p-3">
                  <p className="mb-2 text-sm font-semibold">
                    Choose language / भाषा चुनें
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3">
                    <Search
                      size={18}
                      strokeWidth={1.5}
                      className="text-[var(--text-secondary)]"
                    />
                    <input
                      autoFocus
                      aria-label="Search languages"
                      className="w-full bg-transparent py-2.5 text-sm outline-none"
                      placeholder="Search languages..."
                      value={languageSearch}
                      onChange={(event) =>
                        setLanguageSearch(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div
                  role="listbox"
                  aria-label="Languages"
                  className="max-h-72 overflow-y-auto p-1"
                >
                  {filteredLanguages.map((item) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={languageCode === item.code}
                      key={item.code}
                      onClick={() => selectLanguage(item.code)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm hover:bg-[var(--background)]"
                    >
                      <span>
                        <span className="block font-medium">
                          {item.native}
                        </span>
                        <span className="block text-xs text-[var(--text-secondary)]">
                          {item.name}
                        </span>
                      </span>
                      {languageCode === item.code && (
                        <Check
                          size={18}
                          strokeWidth={1.5}
                          className="text-[var(--primary)]"
                        />
                      )}
                    </button>
                  ))}

                  {filteredLanguages.length === 0 && (
                    <p className="p-4 text-center text-sm text-[var(--text-secondary)]">
                      No languages found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-xl p-2.5 hover:bg-[var(--background)]"
          >
            {dark ? (
              <Sun size={24} strokeWidth={1.5} />
            ) : (
              <Moon size={24} strokeWidth={1.5} />
            )}
          </button>

          {/* Account menu */}
          <div className="relative hidden sm:block" ref={accountRef}>
            <button
              type="button"
              aria-expanded={accountOpen}
              onClick={() => {
                setAccountOpen(!accountOpen);
                setLanguageOpen(false);
                setCategoryOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--background)]"
            >
              <UserRound size={24} strokeWidth={1.5} />
              <span className="max-w-24 truncate">
                {userName ?? "Account"}
              </span>
              <ChevronDown size={16} strokeWidth={1.5} />
            </button>

            {accountOpen && (
              <div className="absolute end-0 top-full mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
                {userName && (
                  <p className="truncate border-b border-[var(--border)] px-3 py-2 text-sm font-semibold">
                    Hello, {userName}
                  </p>
                )}
                <a
                  href="/login"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
                >
                  <LogIn size={20} strokeWidth={1.5} /> Login
                </a>
                <a
                  href="/signup"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
                >
                  <UserPlus size={20} strokeWidth={1.5} /> Sign up
                </a>
                <a
                  href="/orders"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
                >
                  <Package size={20} strokeWidth={1.5} /> Orders
                </a>
                <a
                  href="/wishlist"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
                >
                  <Heart size={20} strokeWidth={1.5} /> Wishlist
                </a>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            aria-label={`Shopping cart, ${cartCount} items`}
              onClick={() => (window.location.href = "/cart")}
            className="relative rounded-xl bg-[var(--primary)] p-2.5 text-white hover:bg-[var(--primary-hover)]"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-xs font-bold text-[#14141F]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            className="rounded-xl p-2.5 hover:bg-[var(--background)] sm:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto hidden max-w-7xl items-center gap-7 px-6 md:flex">
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              aria-expanded={categoryOpen}
              aria-haspopup="true"
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setCategoryOpen(true);
                  setActiveCategory(0);
                }
              }}
              onClick={() => {
                setCategoryOpen(!categoryOpen);
                setLanguageOpen(false);
                setAccountOpen(false);
              }}
              className="flex items-center gap-2 py-3 text-sm font-semibold text-[var(--primary)]"
            >
              {t.categories}
              <ChevronDown size={18} strokeWidth={1.5} />
            </button>

            {categoryOpen && (
              <div className="absolute start-0 top-full z-50 flex w-[min(760px,90vw)] rounded-b-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
                <div className="w-56 border-e border-[var(--border)] p-2">
                  {categories.map((category, index) => (
                    <button
                      type="button"
                      key={category.name}
                      onMouseEnter={() => setActiveCategory(index)}
                      onFocus={() => setActiveCategory(index)}
                      onClick={() => {
                        window.location.href = categoryUrl(category.name);
                      }}
                      className={`w-full rounded-lg px-3 py-3 text-start text-sm ${
                        activeCategory === index
                          ? "bg-[var(--background)] font-semibold text-[var(--primary)]"
                          : "hover:bg-[var(--background)]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-5">
                  <h3 className="mb-4 font-bold">
                    {categories[activeCategory].name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories[activeCategory].items.map((item) => (
                      <a
                        key={item}
                        href={categoryUrl(item)}
                        className="rounded-lg p-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
                      >
                        {item} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a href="#deals" className="py-3 text-sm hover:text-[var(--primary)]">
            {t.deals}
          </a>
          <a
            href="#best-sellers"
            className="py-3 text-sm hover:text-[var(--primary)]"
          >
            {t.bestSellers}
          </a>
          <a
            href="#categories"
            className="py-3 text-sm hover:text-[var(--primary)]"
          >
            {t.allProducts}
          </a>
          <span className="ms-auto py-3 text-sm text-[var(--text-secondary)]">
            {t.footerDescription}
          </span>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="space-y-1 border-t border-[var(--border)] p-3 md:hidden">
            <form
              className="mb-3 flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2"
              onSubmit={(event) => {
                event.preventDefault();
                onSearch?.(search);
                setMobileOpen(false);
              }}
            >
              <Search size={20} strokeWidth={1.5} />
              <input
                aria-label="Search products"
                placeholder={t.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>

            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
              {t.categories}
            </p>

            {categories.map((category) => (
              <a
                key={category.name}
                href={categoryUrl(category.name)}
                className="block rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
              >
                {category.name}
              </a>
            ))}

            <a
              href="/login"
              className="block rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
            >
              Login / Sign up
            </a>
            <a
              href="/orders"
              className="block rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
            >
              Orders
            </a>
            <a
              href="/wishlist"
              className="block rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--background)]"
            >
              Wishlist
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
