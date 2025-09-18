'use client';

import React, { useState, useEffect } from 'react';
import { RequestHistoryItem, PaginatedResponse } from '../types';

interface RequestHistoryProps {
  refreshTrigger: number;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ refreshTrigger }) => {
  const [history, setHistory] = useState<PaginatedResponse<RequestHistoryItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<RequestHistoryItem | null>(null);

  const fetchHistory = async (page = 1, search = '', method = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(method && { method }),
      });

      const response = await fetch(`/api/history?${params}`);
      const data: PaginatedResponse<RequestHistoryItem> = await response.json();
      setHistory(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchHistory(1, searchTerm, methodFilter);
  };

  const handlePageChange = (page: number) => {
    fetchHistory(page, searchTerm, methodFilter);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !history) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Request History</h2>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history && history.data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {history.data.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(item.method)}`}>
                      {item.method}
                    </span>
                    <span className="text-sm text-gray-600 truncate max-w-md">
                      {item.url}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`font-medium ${getStatusColor(item.statusCode)}`}>
                      {item.statusCode}
                    </span>
                    <span className="text-gray-500">{item.responseTime}ms</span>
                    <span className="text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedItem?.id === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.headers && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Headers</h4>
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(JSON.parse(item.headers), null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {item.body && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Request Body</h4>
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                            {item.body}
                          </pre>
                        </div>
                      )}
                      
                      {item.response && (
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-700 mb-2">Response</h4>
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(JSON.parse(item.response), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No requests found. Send some requests to see them here.
          </div>
        )}
      </div>

      {history && history.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((history.page - 1) * history.limit) + 1} to{' '}
            {Math.min(history.page * history.limit, history.total)} of {history.total} results
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(history.totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === history.totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === history.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestHistory;