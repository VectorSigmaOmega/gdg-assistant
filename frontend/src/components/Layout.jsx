import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    // 1. Added `flex flex-col` to make this a vertical flex container
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">
              <Link to="/">AI Grading Assistant</Link>
            </div>
            <nav className="space-x-4">
              <Link to="/assignment-viewer" className="text-gray-600 hover:text-gray-800">Assignment Viewer</Link>
              <Link to="/student-dashboard" className="text-gray-600 hover:text-gray-800">Student Dashboard</Link>
              <Link to="/teacher-dashboard" className="text-gray-600 hover:text-gray-800">Teacher Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 2. Added `flex-1` to make this element grow and fill available space */}
      <main className="container mx-auto px-6 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-600">© 2024 AI Grading Assistant</p>
        </div>
      </footer>
    </div>
  );
}