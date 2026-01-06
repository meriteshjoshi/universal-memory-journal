'use client';

import { useState } from 'react';
import ScreenshotUploader from '@/components/screenshot-uploader';

export default function Home() {
  const [latestEntry, setLatestEntry] = useState<any>(null);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Universal Memory Journal
          </h1>
          <p className="text-lg text-gray-600">
            Save and rediscover meaningful moments from YouTube, Twitter, Instagram, and more.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Upload a Screenshot
          </h2>
          <p className="text-gray-600 mb-6">
            Take a screenshot of a YouTube video, tweet, Instagram post, or any content you want to save.
          </p>

          <ScreenshotUploader
            onUploadComplete={(entry) => {
              setLatestEntry(entry);
            }}
          />
        </div>

        {/* Latest Entry Preview */}
        {latestEntry && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              ✅ Latest Entry
            </h3>

            <div className="space-y-3">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {latestEntry.source_app}
                </span>
                <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {latestEntry.category}
                </span>
              </div>

              <h4 className="text-lg font-medium text-gray-900">
                {latestEntry.title}
              </h4>

              <p className="text-gray-700 italic">
                "{latestEntry.content_text}"
              </p>

              {latestEntry.ai_confidence && (
                <p className="text-sm text-gray-500">
                  AI Confidence: {latestEntry.ai_confidence}%
                </p>
              )}

              {latestEntry.source_url && (
                <a
                  href={latestEntry.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Original →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">🚧 Coming Next</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Browse all your saved entries</li>
            <li>• Search by keyword or category</li>
            <li>• "On This Day" memory surfacing</li>
            <li>• Deep linking back to sources</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
