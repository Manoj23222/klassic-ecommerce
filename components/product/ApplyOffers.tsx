"use client";

export default function ApplyOffers() {
  const offers = [
    {
      title: "Bank Offer",
      text: "10% instant discount on selected credit cards.",
      badge: "BANK",
    },
    {
      title: "Special Price",
      text: "Extra discount already applied on this product.",
      badge: "SALE",
    },
    {
      title: "No Cost EMI",
      text: "EMI available on selected banks and cards.",
      badge: "EMI",
    },
    {
      title: "Partner Offer",
      text: "Get extra Klassic reward points on this order.",
      badge: "PLUS",
    },
  ];

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black">Apply Offers</h2>
        <span className="text-xs font-bold text-blue-600">
          View all
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => (
          <div
            key={offer.title}
            className="rounded-xl border border-green-200 bg-green-50 p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-green-600 px-2 py-1 text-[10px] font-black text-white">
                {offer.badge}
              </span>

              <h3 className="text-sm font-black text-green-800">
                {offer.title}
              </h3>
            </div>

            <p className="text-xs font-semibold leading-5 text-gray-700">
              {offer.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}