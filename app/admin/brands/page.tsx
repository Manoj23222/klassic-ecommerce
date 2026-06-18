import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  await connectDB();

  const products = await Product.find({}).lean();

  const brandMap = new Map<string, any>();

  products.forEach((product: any) => {
    const brand = product.brand || "No Brand";

    if (!brandMap.has(brand)) {
      brandMap.set(brand, {
        name: brand,
        products: 0,
        approved: 0,
        pending: 0,
        categories: new Set(),
      });
    }

    const item = brandMap.get(brand);
    item.products += 1;

    if (product.status === "Approved") item.approved += 1;
    if (product.status === "Pending Approval") item.pending += 1;
    if (product.category) item.categories.add(product.category);
  });

  const brands = Array.from(brandMap.values()).map((brand) => ({
    ...brand,
    categories: Array.from(brand.categories),
  }));

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Catalog Engine
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Brands Master
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Track marketplace brands, catalog coverage and approval status.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Total Brands" value={brands.length} />
          <Stat title="Total Products" value={products.length} />
          <Stat
            title="Approved Products"
            value={products.filter((p: any) => p.status === "Approved").length}
          />
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black">No brands found</h2>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand: any) => (
            <article
              key={brand.name}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Brand
              </p>

              <h2 className="mt-2 text-2xl font-black">{brand.name}</h2>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Info title="Products" value={brand.products} />
                <Info title="Approved" value={brand.approved} />
                <Info title="Pending" value={brand.pending} />
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Categories
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {brand.categories.length === 0 ? (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                      No category
                    </span>
                  ) : (
                    brand.categories.map((category: string) => (
                      <span
                        key={category}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600"
                      >
                        {category}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/45">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3 text-center">
      <p className="text-xs font-black text-gray-400">{title}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}