import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-2">Page not found</p>
      <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-medium">
        Go Home
      </Link>
    </div>
  );
}
