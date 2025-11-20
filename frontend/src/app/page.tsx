'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Avito Clone</h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/listings" className="text-blue-600 hover:text-blue-800">
                  Browse
                </Link>
                <Link href="/my-listings" className="text-blue-600 hover:text-blue-800">
                  My Listings
                </Link>
                <Link href="/profile" className="text-blue-600 hover:text-blue-800">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
                <Link href="/register" className="bg-primary text-white px-4 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4 text-gray-900">
          Find Anything You Need
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Buy and sell goods, services, real estate, and more in your region
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/listings"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Browse Listings
          </Link>
          {!isAuthenticated && (
            <Link
              href="/register"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Create Listing
            </Link>
          )}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-12 text-center text-gray-900">
            Popular Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Cars', icon: '🚗' },
              { name: 'Apartments', icon: '🏠' },
              { name: 'Electronics', icon: '💻' },
              { name: 'Services', icon: '🔧' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/listings?category=${cat.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h4 className="font-semibold text-gray-900">{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
