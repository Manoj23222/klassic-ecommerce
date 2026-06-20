import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BulkUploadRedirect() {
  redirect("/seller/bulk-upload");
}