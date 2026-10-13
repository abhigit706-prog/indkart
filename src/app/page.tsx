
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const categories = [
  { name: "Electronics", image: "/images/electronics.jpg", color: "#E8EDFF" },
  { name: "Fashion", image: "/images/fashion.jpg", color: "#FFF0E5" },
  { name: "Home & Kitchen", image: "/images/home-kitchen.jpg", color: "#E8F5EC" },
  { name: "Beauty", image: "/images/beauty.jpg", color: "#FCE8F1" },
  { name: "Groceries", image: "/images/groceries.jpg", color: "#EEF7E7" },
  { name: "Books", image: "/images/books.jpg", color: "#F1EAFE" },
];


type ApiProduct = {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  category_id: number;
};

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  badge: string;
};

const API_URL = "http://127.0.0.1:8000/api/v1";



const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
useEffect(() => {
  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setProductError("");

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: ApiProduct[] = await response.json();

      const mappedProducts: Product[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: categories.find(
          (category) => category.name === "Electronics"
        )?.name ?? "Products",
        price: Number(item.price),
        oldPrice: Number(item.price),
        image: "/images/electronics.jpg",
        rating: 4.5,
        badge: item.stock > 0 ? "In stock" : "Out of stock",
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProductError("Unable to load products. Please check the backend.");
    } finally {
      setLoadingProducts(false);
    }
  }

  loadProducts();
}, []);
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  
function addToCart(productId: number) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const savedCart = localStorage.getItem("indkart-cart");
  const cartItems: (Product & { quantity: number })[] =
    savedCart ? JSON.parse(savedCart) : [];

  const existingItem = cartItems.find(
    (item) => item.id === productId,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("indkart-cart", JSON.stringify(cartItems));

  setCartCount(
    cartItems.reduce((total, item) => total + item.quantity, 0),
  );

  setAddedProducts((current) => [...current, productId]);

  window.setTimeout(() => {
    setAddedProducts((current) =>
      current.filter((id) => id !== productId),
    );
  }, 1500);
}


  function toggleWishlist(productId: number) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader
        cartCount={cartCount}
        onSearch={(query) => {
          setSearch(query);
          document.getElementById("products")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      />

      {/* Hero banner */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 md:pt-8">
        <div className="relative isolate min-h-[360px] overflow-hidden rounded-2xl bg-[#101522] shadow-sm sm:min-h-[410px] lg:min-h-[460px]">
          <img
            src="/images/hero-banner.png"
            alt="Cricket promotional campaign"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_30%] sm:object-[center_25%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101522]/95 via-[#101522]/75 to-[#101522]/10" />

          <div className="flex min-h-[360px] max-w-xl flex-col items-start justify-center px-6 py-10 sm:min-h-[410px] sm:px-10 lg:min-h-[460px] lg:px-14">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Sparkles size={15} />
              SPORT & LIFESTYLE PICKS
            </span>

            <h1 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Cricket fever.
              <span className="mt-1 block text-[#FF9933]">
                Shopping season.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              Discover sports essentials, everyday favourites and great finds
              for every part of your life with IndKart.
            </p>

            <a
              href="#products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF9933] px-5 py-3.5 text-sm font-bold text-[#171717] shadow-lg transition hover:bg-[#FFB866]"
            >
              Shop the collection
              <ArrowRight size={19} />
            </a>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/80 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#FFB866]" />
                Curated finds
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#FFB866]" />
                Great everyday value
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-semibold tracking-widest text-white/90 backdrop-blur sm:bottom-6 sm:right-6">
            IND KART · EVERYTHING INDIA SHOPS
          </div>
        </div>
      </section>

      {/* Popular categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Find your favourites
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Popular categories
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Something for every part of your day.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className="hidden items-center gap-1 text-sm font-semibold text-[var(--primary)] sm:flex"
          >
            View all <ArrowRight size={17} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={`group overflow-hidden rounded-2xl border text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                activeCategory === category.name
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]"
                  : "border-[var(--border)]"
              }`}
            >
              <div
                className="relative h-32 overflow-hidden sm:h-36"
                style={{ backgroundColor: category.color }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#202033] shadow-sm">
                  Explore
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 bg-[var(--surface)] px-3 py-3">
                <span className="text-sm font-bold">{category.name}</span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-[var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Today's deals */}
      <section id="deals" className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <div className="mb-7 flex items-end justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full bg-[#FFF0D9] px-3 py-1 text-xs font-bold text-[#8A4300]">
                LIMITED-TIME PICKS
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Today&apos;s deals
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Good finds. Better prices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
            >
              See all <ArrowRight size={17} />
            </button>
          </div>

          <ProductGrid
            products={filteredProducts.slice(0, 4)}
            wishlist={wishlist}
            addedProducts={addedProducts}
            onAdd={addToCart}
            onWishlist={toggleWishlist}
          />
        </div>
      </section>

      {/* Best sellers */}
      <section id="best-sellers" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Worth a closer look
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Best sellers
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Popular picks for your everyday needs.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {products.map((product) => (
            <div key={product.id} className="w-[245px] shrink-0 sm:w-[280px]">
              <ProductCard
                product={product}
                wished={wishlist.includes(product.id)}
                added={addedProducts.includes(product.id)}
                onAdd={() => addToCart(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* All products and search */}
      <section id="products" className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {search ? "Search results" : "Explore products"}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {activeCategory === "All"
                  ? "Explore our demo collection."
                  : `Showing ${activeCategory}`}
                {search ? ` for “${search}”` : ""}
              </p>
            </div>

            {(search || activeCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="self-start rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold hover:bg-[var(--background)] sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>
              
          {loadingProducts ? (
            <p className="py-10 text-center text-[var(--text-secondary)]">
              Loading products...
            </p>
          ) : productError ? (
            <p
              role="alert"
              className="py-10 text-center text-red-600"
            >
              {productError}
            </p>
          ) : 
          filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              wishlist={wishlist}
              addedProducts={addedProducts}
              onAdd={addToCart}
              onWishlist={toggleWishlist}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] px-5 py-16 text-center">
              <ShoppingBag
                size={34}
                className="mx-auto mb-3 text-[var(--text-tertiary)]"
              />
              <h3 className="font-bold">No products found</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Try another search or select a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section id="benefits" className="border-y border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-8 sm:grid-cols-3 sm:px-6 md:py-10">
          <TrustItem
            icon={<Truck size={24} strokeWidth={1.5} />}
            title="Delivery information"
            description="Delivery options depend on your location."
          />
          <TrustItem
            icon={<ShieldCheck size={24} strokeWidth={1.5} />}
            title="Shopping with confidence"
            description="Clear product information and pricing."
          />
          <TrustItem
            icon={<RotateCcw size={24} strokeWidth={1.5} />}
            title="Returns made clear"
            description="Review the return policy before ordering."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <a href="/" className="text-2xl font-extrabold tracking-tight">
              Ind<span className="text-[var(--primary)]">Kart</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
              Everything India Shops. Discover everyday essentials, thoughtful
              finds and new favourites in one place.
            </p>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              ["Electronics", "#categories"],
              ["Fashion", "#categories"],
              ["Home & Kitchen", "#categories"],
              ["Today's deals", "#deals"],
            ]}
          />
          <FooterColumn
            title="Your account"
            links={[
              ["Login", "/login"],
              ["Sign up", "/signup"],
              ["Orders", "/orders"],
              ["Wishlist", "/wishlist"],
            ]}
          />
          <div>
            <h3 className="font-bold">Shopping made simple</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Browse by category, discover deals and find your next favourite.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <CheckCircle2 size={18} className="text-[var(--success)]" />
              Designed for everyday shopping
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>© 2026 IndKart. Everything India Shops.</span>
            <span>Designed for everyday shopping in India.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}


function ProductGrid({
  products: items,
  wishlist,
  addedProducts,
  onAdd,
  onWishlist,
}: {
  products: Product[];
  wishlist: number[];
  addedProducts: number[];
  onAdd: (id: number) => void;
  onWishlist: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wished={wishlist.includes(product.id)}
          added={addedProducts.includes(product.id)}
          onAdd={() => onAdd(product.id)}
          onWishlist={() => onWishlist(product.id)}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  wished,
  added,
  onAdd,
  onWishlist,
}: {
  product: Product;
  wished: boolean;
  added: boolean;
  onAdd: () => void;
  onWishlist: () => void;
}) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100,
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-[var(--surface-subtle)] sm:h-52">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-md bg-[#FF9933] px-2 py-1 text-[10px] font-extrabold text-[#20150A] sm:text-xs">
          {discount}% OFF
        </span>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWishlist}
          className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-[#242438] shadow-sm transition hover:scale-105"
        >
          <Heart
            size={18}
            strokeWidth={1.7}
            fill={wished ? "#E11D48" : "none"}
            className={wished ? "text-rose-600" : ""}
          />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          {product.category}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold sm:text-base">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <Star size={14} fill="#F5A623" stroke="#F5A623" />
          {product.rating.toFixed(1)}
          <span>·</span>
          <span>{product.badge}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-extrabold sm:text-lg">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-[var(--text-tertiary)] line-through">
            {formatPrice(product.oldPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--primary-hover)] sm:text-sm"
        >
          {added ? (
            <>
              <CheckCircle2 size={17} />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingBag size={17} />
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--primary)]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold sm:text-base">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
