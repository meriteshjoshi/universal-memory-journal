'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ScreenshotUploaderProps {
  onUploadComplete?: (entry: any) => void;
}

export default function ScreenshotUploader({ onUploadComplete }: ScreenshotUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError('');
    setProgress('Uploading screenshot...');

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      setProgress('Analyzing with AI...');

      const response = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze screenshot');
      }

      const entry = await response.json();
      setProgress('Success! Entry created.');

      if (onUploadComplete) {
        onUploadComplete(entry);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setProgress('');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to process screenshot');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900">{progress}</p>
                <p className="text-sm text-gray-500">This may take a few seconds...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative inline-block">
                <div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                  <svg
                    className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {!isDragActive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {isDragActive ? '📸 Drop it here!' : 'Upload a screenshot'}
                </p>
                <p className="text-sm text-gray-600">
                  {isDragActive ? "We'll analyze it with AI" : 'Drag and drop, or click to browse'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    PNG
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    JPG
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    WEBP
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Upload Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {progress && !uploading && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-green-800">{progress}</p>
          </div>
        </div>
      )}
    </div>
  );
}
