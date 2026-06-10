import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        
        <div>
          <h3 className="text-gray-400 font-bold mb-4">ABOUT</h3>

          <div className="space-y-2">
            <Link href="/contact" className="block hover:text-blue-400">Contact Us</Link>
            <Link href="/about" className="block hover:text-blue-400">About Us</Link>
            <Link href="/careers" className="block hover:text-blue-400">Careers</Link>
            <Link href="/stories" className="block hover:text-blue-400">Klassic Stories</Link>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">HELP</h3>

          <div className="space-y-2">
            <Link href="/payments" className="block hover:text-blue-400">Payments</Link>
            <Link href="/shipping" className="block hover:text-blue-400">Shipping</Link>
            <Link href="/returns" className="block hover:text-blue-400">Cancellation & Returns</Link>
            <Link href="/faq" className="block hover:text-blue-400">FAQ</Link>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">POLICY</h3>

          <div className="space-y-2">
            <Link href="/terms" className="block hover:text-blue-400">Terms Of Use</Link>
            <Link href="/security" className="block hover:text-blue-400">Security</Link>
            <Link href="/privacy" className="block hover:text-blue-400">Privacy</Link>
            <Link href="/sitemap" className="block hover:text-blue-400">Sitemap</Link>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">SOCIAL</h3>

          <div className="space-y-2">
            <a href="#" className="block hover:text-blue-400">Facebook</a>
            <a href="#" className="block hover:text-blue-400">Instagram</a>
            <a href="#" className="block hover:text-blue-400">YouTube</a>
            <a href="#" className="block hover:text-blue-400">X / Twitter</a>
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">MAIL US</h3>

          <p>Klassic Ecommerce</p>
          <p>Jaipur, Rajasthan</p>
          <p>India</p>
          <p className="mt-2 text-gray-400">
            support@klassic.com
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 text-sm">
          <Link href="/admin/product">🛍️ Become a Seller</Link>
          <Link href="/gift-cards">🎁 Gift Cards</Link>
          <Link href="/help-center">❓ Help Center</Link>
          <span>© 2026 Klassic.com</span>
        </div>
      </div>
    </footer>
  );
}