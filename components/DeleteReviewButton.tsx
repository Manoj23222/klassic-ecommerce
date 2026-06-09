"use client";

export default function DeleteReviewButton({ id }: { id: number }) {
  const deleteReview = async () => {
    const confirmDelete = confirm("Delete this review?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Review deleted");
      window.location.reload();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <button
      onClick={deleteReview}
      className="bg-red-600 text-white px-3 py-2 rounded"
    >
      Delete
    </button>
  );
}