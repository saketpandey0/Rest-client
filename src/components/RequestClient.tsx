// components/RequestClient.tsx
'use client';

import React, { useState } from 'react';
import RequestForm from './RequestForm';
import ResponseDisplay from './Response';
import RequestHistory from './RequestHistory';
import { HttpResponse } from '../types';

export default function RequestClient() {
  const [currentResponse, setCurrentResponse] = useState<HttpResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleResponse = (response: HttpResponse) => {
    setCurrentResponse(response);
    // Trigger history refresh when a new request is made
    setHistoryRefresh(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Request Form and Response */}
      <div className="space-y-8">
        <RequestForm
          onResponse={handleResponse}
          loading={loading}
          setLoading={setLoading}
        />
        <ResponseDisplay response={currentResponse} />
      </div>

      {/* Right Column - Request History */}
      <div>
        <RequestHistory refreshTrigger={historyRefresh} />
      </div>
    </div>
  );
}
