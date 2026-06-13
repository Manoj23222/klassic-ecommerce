import Link from "next/link";

export default function BecomeSellerPage() {
  return (
    <main className="min-h-screen bg-white">
    

      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold">
            Klassic <span className="text-blue-600">Seller Hub</span>
          </Link>

          <nav className="hidden md:flex gap-8 font-semibold text-gray-700">
            <a href="#sell">Sell Online</a>
            <a href="#fees">Fees</a>
            <a href="#grow">Grow</a>
            <a href="#learn">Learn</a>
          </nav>

          <div className="flex gap-3">
            <Link href="/seller/login" className="px-5 py-3 font-bold">
              Login
            </Link>
            <Link
              href="/seller/register"
              className="bg-yellow-400 text-black px-7 py-3 rounded-xl font-extrabold"
            >
              Register Now
            </Link>
          </div>
        </div>
      </header>

      <section id="sell" className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-500 font-semibold mb-6">Home › Sell Online</p>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
              Sell Online with Klassic
            </h1>

            <p className="text-gray-600 text-lg mt-6 max-w-2xl">
              Start your online selling journey with Klassic Marketplace. Create your seller account,
              list products, manage orders and grow faster with smart seller tools.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                href="/seller/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-extrabold"
              >
                Start Selling
              </Link>

              <Link
                href="/seller/login"
                className="border px-8 py-4 rounded-2xl font-extrabold"
              >
                Seller Login
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-[2rem] border shadow p-8 text-center">
            <div className="text-8xl mb-4">🏪</div>
            <h2 className="text-3xl font-extrabold">Klassic Seller</h2>
            <p className="text-gray-600 mt-2">Your store. Your products. Your growth.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-xl border grid md:grid-cols-5 overflow-hidden">
          <Benefit icon="👥" title="More Customers" text="Reach India-wide buyers" />
          <Benefit icon="💳" title="Secure Payments" text="Fast settlements" />
          <Benefit icon="📉" title="Low Cost" text="Easy start for sellers" />
          <Benefit icon="☎️" title="Seller Support" text="Help when needed" />
          <Benefit icon="🎁" title="Offers & Deals" text="Festival sale ready" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold mb-8">
          Seller <span className="text-blue-600">Success</span> Stories
        </h2>

        <div className="bg-blue-50 rounded-[2rem] p-8 md:p-12 grid md:grid-cols-[140px_1fr] gap-6 items-center">
          <div className="w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center text-5xl mx-auto">
            👨‍💼
          </div>

          <div>
            <h3 className="text-2xl font-extrabold">Ravi Sharma, Klassic Store</h3>
            <p className="text-gray-700 mt-3 leading-8">
              “Starting with one category, Klassic helped us manage products, orders and customer reach.
              Seller Hub tools made selling simple and faster.”
            </p>
          </div>
        </div>
      </section>

      <section id="learn" className="max-w-7xl mx-auto px-4 py-10 border-t">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          <aside className="space-y-3">
            {["Create Account", "List Products", "Storage & Shipping", "Receive Payments", "Grow Faster", "Help & Support"].map(
              (item, index) => (
                <a
                  key={item}
                  href="#create-account"
                  className={`block px-5 py-4 rounded-xl font-bold border ${
                    index === 0 ? "border-blue-500 text-blue-600 bg-blue-50" : "bg-white"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </aside>

          <div id="create-account">
            <h2 className="text-3xl font-extrabold">Create Account</h2>
            <div className="w-16 h-1 bg-blue-600 rounded mt-4 mb-6" />

            <p className="text-gray-700 leading-8 max-w-3xl">
              Creating your Klassic seller account is simple. Keep your Gmail, mobile number,
              PAN details, store name and pickup address ready. GST is optional for selected
              categories.
            </p>

            <div className="bg-white border rounded-[2rem] p-8 mt-8">
              <h3 className="text-2xl font-extrabold mb-5">Don’t have GSTIN?</h3>
              <p className="text-gray-600 mb-6">You can still apply for seller account in allowed categories.</p>

              <div className="grid md:grid-cols-3 gap-5">
                <Step icon="👤" title="Register" text="Create seller account" />
                <Step icon="📋" title="Fill GST Later" text="Add GST anytime" />
                <Step icon="✅" title="Submit Application" text="Admin will review" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="grow" className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-extrabold mb-8">
          Popular Categories to Sell Across India
        </h2>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {[
            "Mobile Accessories",
            "Clothes",
            "Shoes",
            "Electronics",
            "Home & Kitchen",
            "Beauty Products",
            "Toys",
            "Furniture",
            "Grocery",
            "Sports",
            "Jewellery",
            "Books",
          ].map((item) => (
            <div key={item} className="border rounded-xl p-4 bg-white font-semibold">
              Sell {item} Online
            </div>
          ))}
        </div>
      </section>

      <section id="fees" className="max-w-7xl mx-auto px-4 py-14 border-t">
        <h2 className="text-3xl font-extrabold mb-8">Storage, Shipping & Payments</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Info title="Storage" text="Seller can store products at own location or future Klassic warehouse system." />
          <Info title="Shipping" text="Orders can be processed with local delivery or future partner courier support." />
          <Info title="Payments" text="Seller earnings, settlements and wallet system will be visible in Seller Hub." />
        </div>
      </section>

      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-2xl font-extrabold">
              Klassic <span className="text-blue-600">Seller</span>
            </h3>
            <p className="text-gray-600 mt-3">Sell online with Klassic Marketplace.</p>
          </div>

          <FooterCol title="Sell Online" links={["Create Account", "List Products", "Storage & Shipping", "Fees & Commission"]} />
          <FooterCol title="Grow Your Business" links={["AI Tools", "Seller Badges", "Reports", "Seller Support"]} />
          <FooterCol title="Learn More" links={["FAQs", "Seller Stories", "Seller Blog", "Help Center"]} />
        </div>
      </footer>
    </main>
  );
}

function Benefit({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="p-7 text-center border-r last:border-r-0">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-extrabold">{title}</h3>
      <p className="text-gray-500 text-sm mt-2">{text}</p>
    </div>
  );
}

function Step({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="border rounded-2xl p-5">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-extrabold">{title}</h4>
      <p className="text-gray-500 text-sm mt-2">{text}</p>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow">
      <h3 className="text-xl font-extrabold mb-3">{title}</h3>
      <p className="text-gray-600 leading-7">{text}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-extrabold mb-3">{title}</h4>
      <div className="space-y-2 text-gray-600">
        {links.map((link) => (
          <p key={link}>{link}</p>
        ))}
      </div>
    </div>
  );
}