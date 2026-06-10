import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div>
          <h3 className="text-gray-400 font-bold mb-4">ABOUT</h3>
          <p>Contact Us</p>
          <p>About Us</p>
          <p>Careers</p>
          <p>Klassic Stories</p>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">HELP</h3>
          <p>Payments</p>
          <p>Shipping</p>
          <p>Cancellation & Returns</p>
          <p>FAQ</p>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">POLICY</h3>
          <p>Terms Of Use</p>
          <p>Security</p>
          <p>Privacy</p>
          <p>Sitemap</p>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">SOCIAL</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>YouTube</p>
          <p>X / Twitter</p>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold mb-4">MAIL US</h3>
          <p>Klassic Ecommerce</p>
          <p>Jaipur, Rajasthan</p>
          <p>India</p>
        </div>
      </div>

      <div className="border-t border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 text-sm">
          <Link href="/admin/product">🛍️ Become a Seller</Link>
          <span>⭐ Advertise</span>
          <span>🎁 Gift Cards</span>
          <span>❓ Help Center</span>
          <span>© 2026 Klassic.com</span>
        </div>
      </div>
    </footer>
    
  );
}