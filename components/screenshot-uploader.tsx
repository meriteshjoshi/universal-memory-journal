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
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
              <p className="text-gray-600">{progress}</p>
            </>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop your screenshot here' : 'Upload a screenshot'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop, or click to select
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: YouTube, Twitter, Instagram screenshots
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {progress && !uploading && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">✅ {progress}</p>
        </div>
      )}
    </div>
  );
}
