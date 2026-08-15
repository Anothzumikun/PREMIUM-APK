import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-base-950">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
