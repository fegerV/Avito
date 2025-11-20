'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { getCachedData, setCachedData } from '@/lib/api';
import { Listing } from '@/types';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `listing-${id}`;
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setListing(cachedData);
        setLoading(false);
        return;
      }

      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
      setCachedData(cacheKey, response.data);
    } catch (err: any) {
      console.error('Failed to fetch listing:', err);
      setError(err.response?.data?.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Avito Clone
            </Link>
            <Link href="/listings" className="text-blue-600 font-semibold">
              ← Back to Listings
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 text-lg">Loading listing...</p>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Avito Clone
            </Link>
            <Link href="/listings" className="text-blue-600 font-semibold">
              ← Back to Listings
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Listing not found'}</p>
          <button
            onClick={() => router.push('/listings')}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Listings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Avito Clone
          </Link>
          <Link href="/listings" className="text-blue-600 font-semibold">
            ← Back to Listings
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {listing.images.length > 0 ? (
                <div className="relative">
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {listing.images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}

              {listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
                        index === currentImageIndex
                          ? 'border-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={`${listing.title} - ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span>👁 {listing.views} views</span>
                <span>•</span>
                <span>📅 {new Date(listing.createdAt).toLocaleDateString()}</span>
                {listing.category && (
                  <>
                    <span>•</span>
                    <span>📂 {listing.category.name}</span>
                  </>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>

              {listing.customFields && Object.keys(listing.customFields).length > 0 && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-3">Additional Information</h2>
                  <dl className="grid grid-cols-2 gap-4">
                    {Object.entries(listing.customFields).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-sm text-gray-900 mt-1">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              {listing.price && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-4xl font-bold text-primary">
                    ₽{listing.price.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {listing.city}, {listing.region}
                </p>
              </div>

              {listing.user && (
                <div className="mb-6 border-t pt-6">
                  <p className="text-sm text-gray-600 mb-2">Seller</p>
                  <div className="flex items-center gap-3">
                    {listing.user.profileImageUrl ? (
                      <img
                        src={listing.user.profileImageUrl}
                        alt={listing.user.firstName || 'Seller'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-xl">
                          {listing.user.firstName?.[0] || listing.user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {listing.user.firstName && listing.user.lastName
                          ? `${listing.user.firstName} ${listing.user.lastName}`
                          : listing.user.email}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{listing.user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3">
                Contact Seller
              </button>

              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
