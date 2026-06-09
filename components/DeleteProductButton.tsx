"use client";

export default function DeleteProductButton({
  id,
}: {
  id: number;
}) {
  const deleteProduct = async () => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch("/api/admin/delete-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Product deleted");
      window.location.reload();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <button
      onClick={deleteProduct}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  );
}