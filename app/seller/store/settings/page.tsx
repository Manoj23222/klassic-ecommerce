"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function SellerStoreSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    storeVisibility: "Public",
    returnPolicy: "",
    shippingPolicy: "",
    autoApproveOrders: "No",
    vacationMode: false,
    codEnabled: true,
    freeShipping: false,
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    aiSeo: true,
    aiDescription: true,
    minimumOrderAmount: "",
    processingTime: "1-2 Days",
  });

  async function saveSettings() {
    setLoading(true);

    setTimeout(() => {
      toast.success("Store settings saved successfully");
      setLoading(false);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      <section className="mx-auto max-w-7xl px-3 py-4 md:px-6">
        <div className="mb-4">
          <p className="text-sm font-black text-orange-600">
            KLASSIC SELLER
          </p>

          <h1 className="text-3xl font-black text-slate-950">
            Store Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage store preferences, automation and seller options.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                Store Preferences
              </h2>

              <div className="mt-5 space-y-4">
                <Field title="Store Visibility">
                  <select
                    value={settings.storeVisibility}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storeVisibility: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border p-3"
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </Field>

                <Field title="Minimum Order Amount">
                  <input
                    type="number"
                    placeholder="500"
                    value={settings.minimumOrderAmount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minimumOrderAmount: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border p-3"
                  />
                </Field>

                <Field title="Default Processing Time">
                  <select
                    value={settings.processingTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        processingTime: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border p-3"
                  >
                    <option>1-2 Days</option>
                    <option>2-3 Days</option>
                    <option>3-5 Days</option>
                    <option>5-7 Days</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                Store Policies
              </h2>

              <div className="mt-5 space-y-4">
                <Field title="Return Policy">
                  <textarea
                    value={settings.returnPolicy}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        returnPolicy: e.target.value,
                      })
                    }
                    className="h-32 w-full rounded-2xl border p-3"
                    placeholder="Enter return policy..."
                  />
                </Field>

                <Field title="Shipping Policy">
                  <textarea
                    value={settings.shippingPolicy}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shippingPolicy: e.target.value,
                      })
                    }
                    className="h-32 w-full rounded-2xl border p-3"
                    placeholder="Enter shipping policy..."
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                Automation
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SwitchCard
                  title="Auto Approve Orders"
                  enabled={settings.autoApproveOrders === "Yes"}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      autoApproveOrders:
                        settings.autoApproveOrders === "Yes"
                          ? "No"
                          : "Yes",
                    })
                  }
                />

                <SwitchCard
                  title="Vacation Mode"
                  enabled={settings.vacationMode}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      vacationMode: !settings.vacationMode,
                    })
                  }
                />

                <SwitchCard
                  title="Cash On Delivery"
                  enabled={settings.codEnabled}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      codEnabled: !settings.codEnabled,
                    })
                  }
                />

                <SwitchCard
                  title="Free Shipping"
                  enabled={settings.freeShipping}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      freeShipping: !settings.freeShipping,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                Notifications
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SwitchCard
                  title="Email Notifications"
                  enabled={settings.emailNotifications}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      emailNotifications:
                        !settings.emailNotifications,
                    })
                  }
                />

                <SwitchCard
                  title="SMS Notifications"
                  enabled={settings.smsNotifications}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      smsNotifications:
                        !settings.smsNotifications,
                    })
                  }
                />

                <SwitchCard
                  title="Low Stock Alert"
                  enabled={settings.lowStockAlert}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      lowStockAlert:
                        !settings.lowStockAlert,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                AI Features
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SwitchCard
                  title="AI SEO Generator"
                  enabled={settings.aiSeo}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      aiSeo: !settings.aiSeo,
                    })
                  }
                />

                <SwitchCard
                  title="AI Product Description"
                  enabled={settings.aiDescription}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      aiDescription:
                        !settings.aiDescription,
                    })
                  }
                />
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={loading}
              className="w-full rounded-2xl bg-orange-600 py-4 font-black text-white disabled:bg-gray-400"
            >
              {loading
                ? "Saving Settings..."
                : "Save Store Settings"}
            </button>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="text-xl font-black">
                Store Status
              </h2>

              <div className="mt-4 space-y-3">
                <StatusBox
                  label="Store Visibility"
                  value={settings.storeVisibility}
                />

                <StatusBox
                  label="COD"
                  value={
                    settings.codEnabled
                      ? "Enabled"
                      : "Disabled"
                  }
                />

                <StatusBox
                  label="Free Shipping"
                  value={
                    settings.freeShipping
                      ? "Enabled"
                      : "Disabled"
                  }
                />

                <StatusBox
                  label="Vacation Mode"
                  value={
                    settings.vacationMode
                      ? "ON"
                      : "OFF"
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white shadow">
              <h3 className="text-xl font-black">
                AI Recommendation
              </h3>

              <p className="mt-2 text-sm">
                Enable AI SEO + AI Description
                for better product ranking and
                sales performance.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-black">
        {title}
      </label>
      {children}
    </div>
  );
}

function SwitchCard({
  title,
  enabled,
  onClick,
}: {
  title: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border p-4 text-left"
    >
      <span className="font-bold">{title}</span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          enabled
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function StatusBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <p className="text-xs font-black text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}