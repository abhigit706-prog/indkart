
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

type CartProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  badge: string;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("indkart-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  function saveCart(nextItems: CartProduct[]) {
    setItems(nextItems);
    localStorage.setItem("indkart-cart", JSON.stringify(nextItems));
    window.dispatchEvent(new Event("indkart-cart-updated"));
  }

  function changeQuantity(id: number, change: number) {
    saveCart(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: number) {
    saveCart(items.filter((item) => item.id !== id));
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const money = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  if (!loaded) {
    return <main className="min-h-screen p-10">Loading cart...</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft size={18} /> Continue shopping
        </Link>

        <h1 className="mb-8 text-3xl font-extrabold">
          My Shopping Cart ({totalItems})
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
            <ShoppingBag size={56} className="mx-auto mb-5 text-[var(--primary)]" />
            <h2 className="mb-2 text-xl font-bold">Your cart is empty</h2>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">
              Explore our products and add something you love.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-28 rounded-xl bg-[var(--background)] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="mt-1 text-lg font-extrabold text-[var(--primary)]">
                      {money(item.price)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => changeQuantity(item.id, -1)}
                          className="rounded p-1 hover:bg-[var(--background)]"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-5 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => changeQuantity(item.id, 1)}
                          className="rounded p-1 hover:bg-[var(--background)]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="mb-5 text-lg font-bold">Price Details</h2>
              <div className="flex justify-between gap-3 text-sm">
                <span>Items ({totalItems})</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="mt-4 flex justify-between gap-3 border-t border-[var(--border)] pt-4 text-lg font-extrabold">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                Delivery charges and final pricing will be shown at checkout.
              </p>
              <Link
                href="/address"
                className="mt-6 block w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center font-semibold text-white hover:bg-[var(--primary-hover)]"
                >
                Proceed to Checkout
                </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
