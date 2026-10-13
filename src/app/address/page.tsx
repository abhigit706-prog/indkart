
"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] items-center justify-center rounded-xl border border-[var(--border)]">
        Loading map...
      </div>
    ),
  },
);

type PostOffice = {
  Name: string;
  District: string;
  State: string;
};

type DeliveryAddress = {
  fullName: string;
  mobile: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number | null;
  longitude: number | null;
};

const initialAddress: DeliveryAddress = {
  fullName: "",
  mobile: "",
  house: "",
  street: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
  latitude: null,
  longitude: null,
};

export default function AddressPage() {
  const [address, setAddress] =
    useState<DeliveryAddress>(initialAddress);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState("");

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--primary)]";

  function updateField(
    field: keyof DeliveryAddress,
    value: string,
  ) {
    setAddress((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError("");
  }

  async function lookupPin(pin: string) {
    setPostOffices([]);
    setPinMessage("");
    setError("");

    if (!/^[0-9]{6}$/.test(pin)) return;

    setPinLoading(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`,
      );

      if (!response.ok) {
        throw new Error("PIN lookup failed");
      }

      const result = await response.json();
      const offices: PostOffice[] = result?.[0]?.PostOffice ?? [];

      if (result?.[0]?.Status !== "Success" || offices.length === 0) {
        setPinMessage("PIN code not found. Please check it.");
        return;
      }

      setPostOffices(offices);

      const firstOffice = offices[0];

      setAddress((current) => ({
        ...current,
        city: firstOffice.District ?? "",
        state: firstOffice.State ?? "",
        area: "",
      }));

      setPinMessage(
        "PIN code found. Please select your correct area or post office.",
      );
    } catch {
      setPinMessage(
        "Unable to look up this PIN code. Please enter the address manually.",
      );
    } finally {
      setPinLoading(false);
    }
  }

  function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);

    if (address.latitude === null || address.longitude === null) {
      setError("Please select your delivery location on the map.");
      return;
    }

    if (postOffices.length > 0 && !address.area) {
      setError("Please select your area or post office.");
      return;
    }

    try {
      const existing: DeliveryAddress[] = JSON.parse(
        localStorage.getItem("indkart-addresses") || "[]",
      );

      localStorage.setItem(
        "indkart-addresses",
        JSON.stringify([...existing, address]),
      );

      setSaved(true);
    } catch {
      setError("Unable to save the address in this browser.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft size={18} />
          Back to cart
        </Link>

        <h1 className="mb-2 text-3xl font-extrabold">
          Delivery Address
        </h1>

        <p className="mb-8 text-[var(--text-secondary)]">
          Enter your details and select your delivery location on the map.
        </p>

        <form onSubmit={saveAddress} className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <h2 className="text-xl font-bold">Contact details</h2>

            <input
              required
              minLength={2}
              maxLength={100}
              placeholder="Full name"
              aria-label="Full name"
              className={inputClass}
              value={address.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
            />

            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              placeholder="10-digit mobile number"
              aria-label="Mobile number"
              className={inputClass}
              value={address.mobile}
              onChange={(e) =>
                updateField(
                  "mobile",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
            />

            <h2 className="pt-3 text-xl font-bold">Address details</h2>

            <input
              required
              maxLength={150}
              placeholder="House / Flat / Building"
              aria-label="House or building"
              className={inputClass}
              value={address.house}
              onChange={(e) => updateField("house", e.target.value)}
            />

            <input
              required
              maxLength={150}
              placeholder="Street / Landmark"
              aria-label="Street or landmark"
              className={inputClass}
              value={address.street}
              onChange={(e) => updateField("street", e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="pinCode">
                PIN code
              </label>

              <input
                id="pinCode"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                className={inputClass}
                value={address.pinCode}
                onChange={(e) => {
                  const pin = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  updateField("pinCode", pin);
                  setPostOffices([]);
                  setPinMessage("");

                  if (pin.length === 6) {
                    void lookupPin(pin);
                  } else {
                    setAddress((current) => ({
                      ...current,
                      area: "",
                      city: "",
                      state: "",
                    }));
                  }
                }}
              />

              {pinLoading && (
                <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <LoaderCircle size={16} className="animate-spin" />
                  Looking up your PIN code...
                </p>
              )}

              {pinMessage && (
                <p role="status" className="text-sm text-[var(--text-secondary)]">
                  {pinMessage}
                </p>
              )}
            </div>

            {postOffices.length > 0 && (
              <div className="space-y-2">
                <label
                  htmlFor="area"
                  className="block text-sm font-medium"
                >
                  Area / Post Office
                </label>

                <select
                  id="area"
                  required
                  className={inputClass}
                  value={address.area}
                  onChange={(e) => {
                    const office = postOffices.find(
                      (item) => item.Name === e.target.value,
                    );

                    setAddress((current) => ({
                      ...current,
                      area: e.target.value,
                      city: office?.District ?? current.city,
                      state: office?.State ?? current.state,
                    }));

                    setSaved(false);
                  }}
                >
                  <option value="">Select your area</option>
                  {postOffices.map((office, index) => (
                    <option
                      key={`${office.Name}-${index}`}
                      value={office.Name}
                    >
                      {office.Name} — {office.District}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City / District
                </label>
                <input
                  id="city"
                  required
                  maxLength={100}
                  placeholder="City / District"
                  className={inputClass}
                  value={address.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <input
                  id="state"
                  required
                  maxLength={100}
                  placeholder="State"
                  className={inputClass}
                  value={address.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <MapPin className="text-[var(--primary)]" size={24} />
              <h2 className="text-xl font-bold">Pin your location</h2>
            </div>

            <LocationPicker
              onSelect={(latitude, longitude) => {
                setAddress((current) => ({
                  ...current,
                  latitude,
                  longitude,
                }));
                setSaved(false);
                setError("");
              }}
            />

            {address.latitude !== null &&
              address.longitude !== null && (
                <p className="text-sm text-green-700">
                  Location selected: {address.latitude.toFixed(6)},{" "}
                  {address.longitude.toFixed(6)}
                </p>
              )}
          </section>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-green-300 p-4 text-green-700">
              <CheckCircle size={20} />
              Address saved successfully!
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--primary)] px-5 py-4 font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Save Delivery Address
          </button>
        </form>
      </div>
    </main>
  );
}
