import Link from "next/link";
import db from "@/lib/db";

export default async function HeaderCategories() {
  const [categories]: any = await db.query(`
    SELECT DISTINCT category
    FROM products
    WHERE category IS NOT NULL
    AND category != ''
    ORDER BY category
  `);

  return (
    <>
      {categories.map((cat: any) => (
        <Link
          key={cat.category}
          href={`/category/${encodeURIComponent(cat.category)}`}
          className="hover:text-yellow-300"
        >
          {cat.category}
        </Link>
      ))}
    </>
  );
}