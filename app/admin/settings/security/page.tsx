import connectDB from "@/lib/mongodb";
import AdminSecurityLog from "@/models/AdminSecurityLog";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  await connectDB();

  const logs = await AdminSecurityLog.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Staff & RBAC
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Security Logs
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Track admin actions, login activity and access events.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🛡️</div>
          <h2 className="mt-4 text-2xl font-black">No security logs yet</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Admin activity logs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log: any) => (
            <article
              key={String(log._id)}
              className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    {log.module || "System"}
                  </p>

                  <h2 className="mt-2 text-lg font-black">
                    {log.action || "Admin Action"}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {log.admin_email || "Unknown admin"}
                  </p>

                  {log.note && (
                    <p className="mt-2 text-sm font-semibold text-gray-600">
                      {log.note}
                    </p>
                  )}
                </div>

                <div className="text-left md:text-right">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${
                      log.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : log.status === "Warning"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {log.status || "Success"}
                  </span>

                  <p className="mt-3 text-xs font-semibold text-gray-500">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString("en-IN")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Info label="IP Address" value={log.ip_address || "-"} />
                <Info label="User Agent" value={log.user_agent || "-"} />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-bold text-gray-700">{value}</p>
    </div>
  );
}