import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { Clipboard, Trash2, Key, Check, AlertCircle, Loader2, Plus } from 'lucide-react';
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
        setToasts(prev => prev.filter(toast => toast.id !== id));
        setToasts(prev => [...prev, newToast]);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => new Set([...prev, id]));
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, { withCredentials: true });
      const newKeys = userKeys.filter((key) => key.id !== id);
      setUserKeys(newKeys);
      addToast('API key deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to delete API key. Please try again.', 'error');
    } finally {
      setDeletingIds(prev => {
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
      setCopiedKeys(prev => new Set([...prev, key]));
      addToast('API key copied to clipboard!', 'success');
      
      setTimeout(() => {
        setCopiedKeys(prev => {
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
      success: <Check className="w-5 h-5" />,
      error: <AlertCircle className="w-5 h-5" />,
      info: <AlertCircle className="w-5 h-5" />
    };

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800', 
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-sm transition-all duration-300 ${colors[toast.type]}`}>
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 min-w-80">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Key className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">API Key Manager</h1>
          </div>
          <p className="text-gray-600">Generate and manage your API keys securely</p>
        </div>

        {/* Generate Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New API Key</h2>
            
            {apiKey && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {apiKey}
                  </code>
                  <button
                    onClick={() => handleCopy(apiKey)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    {copiedKeys.has(apiKey) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Generate API Key
                </>
              )}
            </button>
          </div>
        </div>

        {/* Keys List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your existing API keys</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading your API keys...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-600 mb-4">Failed to load API keys</p>
              <button
                onClick={getUserKeys}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : userKeys.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-700">
                <div className="col-span-7">API Key</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>
              
              {/* Keys */}
              {userKeys.map((key) => (
                <div
                  key={key.id}
                  className="grid grid-cols-12 items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="col-span-7">
                    <code className="text-sm font-mono text-gray-800 break-all bg-gray-100 px-3 py-2 rounded-lg">
                      {key.key}
                    </code>
                  </div>
                  
                  <div className="col-span-2 flex justify-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        key.isActive
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${key.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleCopy(key.key)}
                      className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      {copiedKeys.has(key.key) ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(key.id)}
                      disabled={deletingIds.has(key.id)}
                      className="flex items-center justify-center w-9 h-9 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete key"
                    >
                      {deletingIds.has(key.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Key className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">No API keys found</p>
              <p className="text-sm text-gray-500">Generate your first API key to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}