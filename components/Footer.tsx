import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#151515] text-white mb-16 md:mb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 text-sm md:grid-cols-[1fr_1fr_1fr_1fr_1.3fr]">
        <FooterGroup
          title="ABOUT"
          links={[
            ["Contact Us", "/contact"],
            ["About Us", "/about"],
            ["Careers", "/careers"],
            ["Klassic Stories", "/stories"],
            ["Corporate Information", "/corporate"],
          ]}
        />

        <FooterGroup
          title="HELP"
          links={[
            ["Payments", "/payments"],
            ["Shipping", "/shipping"],
            ["Cancellation & Returns", "/returns"],
            ["FAQ", "/faq"],
            ["Help Center", "/help-center"],
          ]}
        />

        <FooterGroup
          title="CONSUMER POLICY"
          links={[
            ["Terms Of Use", "/terms"],
            ["Security", "/security"],
            ["Privacy", "/privacy"],
            ["Sitemap", "/sitemap"],
            ["Grievance Redressal", "/grievance"],
          ]}
        />

        <FooterGroup
          title="SELLER"
          links={[
            ["Become a Seller", "/seller/register"],
            ["Seller Login", "/seller/login"],
            ["Seller Dashboard", "/seller"],
            ["Advertise", "/advertise"],
            ["Gift Cards", "/gift-cards"],
          ]}
        />

        <div className="border-white/10 md:border-l md:pl-8">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-white/40">
            MAIL US
          </h3>

          <div className="space-y-1 font-semibold leading-6 text-white/80">
            <p>Klassic Ecommerce Private Limited,</p>
            <p>Jaipur, Rajasthan, India</p>
            <p>Email: support@klassic.com</p>
            <p>Phone: +91 00000 00000</p>
          </div>

          <h3 className="mb-3 mt-6 text-xs font-black uppercase tracking-widest text-white/40">
            SOCIAL
          </h3>

          <div className="flex gap-3">
            {["f", "𝕏", "▶", "◎"].map((item) => (
              <span
                key={item}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-black"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm font-semibold text-white/80">
          <div className="flex flex-wrap gap-6">
            <Link href="/seller/register" className="hover:text-white">
              🛍️ Become a Seller
            </Link>

            <Link href="/advertise" className="hover:text-white">
              ✨ Advertise
            </Link>

            <Link href="/gift-cards" className="hover:text-white">
              🎁 Gift Cards
            </Link>

            <Link href="/help-center" className="hover:text-white">
              ❓ Help Center
            </Link>
          </div>

          <span>© 2026 Klassic.com</span>

          <div className="flex flex-wrap gap-2">
            {["VISA", "MC", "UPI", "COD"].map((item) => (
              <span
                key={item}
                className="rounded bg-white px-2 py-1 text-[10px] font-black text-black"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-white/40">
        {title}
      </h3>

      <div className="space-y-2">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="block font-bold text-white/85 transition hover:text-orange-300"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}