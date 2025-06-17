import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { AlertCircle, Check, Clipboard, Key, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Route = createFileRoute('/auth/_layout/generateKey')({
  component: RouteComponent,
});

interface UserKey {
  id: number;
  key: string;
  isActive: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function RouteComponent() {
  const [apiKey, setApiKey] = useState('');
  const [userKeys, setUserKeys] = useState<UserKey[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      setToasts((prev) => [...prev, newToast]);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleDelete = async (id: number) => {
    setDeletingIds((prev) => new Set([...prev, id]));
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, { withCredentials: true });
      const newKeys = userKeys.filter((key) => key.id !== id);
      setUserKeys(newKeys);
      addToast('API key deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to delete API key. Please try again.', 'error');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get(`${BASE_URL}/apikey`, { withCredentials: true });
      setApiKey(response.data.Api_Key);
      addToast('New API key generated successfully!', 'success');
      // Refresh the keys list
      await getUserKeys();
    } catch (error) {
      console.error(error);
      addToast('Failed to generate API key. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getUserKeys = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get(`${BASE_URL}/userkeys`, { withCredentials: true });
      setUserKeys(response.data.userKeys);
    } catch (error) {
      console.error(error);
      setIsError(true);
      addToast('Failed to load API keys', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserKeys();
  }, []);

  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeys((prev) => new Set([...prev, key]));
      addToast('API key copied to clipboard!', 'success');

      setTimeout(() => {
        setCopiedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const Toast = ({ toast }: { toast: Toast }) => {
    const icons = {
      success: <Check className="h-5 w-5" />,
      error: <AlertCircle className="h-5 w-5" />,
      info: <AlertCircle className="h-5 w-5" />,
    };

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
      <div
        className={`flex items-center gap-3 rounded-lg border p-4 shadow-sm transition-all duration-300 ${colors[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          className="ml-auto text-gray-400 transition-colors hover:text-gray-600"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 min-w-80 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Key className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">API Key Manager</h1>
          </div>
          <p className="text-gray-600">Generate and manage your API keys securely</p>
        </div>

        {/* Generate Section */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Generate New API Key</h2>

            {apiKey && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <code className="flex-1 font-mono text-sm break-all text-gray-800">{apiKey}</code>
                  <button
                    onClick={() => handleCopy(apiKey)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {copiedKeys.has(apiKey) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Generate API Key
                </>
              )}
            </button>
          </div>
        </div>

        {/* Keys List Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
            <p className="mt-1 text-sm text-gray-600">Manage your existing API keys</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading your API keys...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
              <p className="mb-4 text-gray-600">Failed to load API keys</p>
              <button
                onClick={getUserKeys}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : userKeys.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-700">
                <div className="col-span-7">API Key</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>

              {/* Keys */}
              {userKeys.map((key) => (
                <div
                  key={key.id}
                  className="grid grid-cols-12 items-center gap-4 border-b border-gray-50 p-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="col-span-7">
                    <code className="rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm break-all text-gray-800">
                      {key.key}
                    </code>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        key.isActive
                          ? 'border border-green-200 bg-green-100 text-green-700'
                          : 'border border-red-200 bg-red-100 text-red-700'
                      }`}
                    >
                      <div className={`mr-2 h-2 w-2 rounded-full ${key.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleCopy(key.key)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      {copiedKeys.has(key.key) ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(key.id)}
                      disabled={deletingIds.has(key.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete key"
                    >
                      {deletingIds.has(key.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Key className="mb-4 h-12 w-12 text-gray-300" />
              <p className="mb-2 text-gray-600">No API keys found</p>
              <p className="text-sm text-gray-500">Generate your first API key to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
