import SidebarAdmin from "./SidebarAdmin";
import Topbar from "./Topbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        <Topbar />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
