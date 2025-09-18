'use client';


import React, { useState } from "react";
import { HttpResponse } from "../types";

interface ResponseDisplayProps {
  response: HttpResponse | null;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");

  if (!response) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-500">
          No response yet. Send a request to see the response here.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 bg-green-100";
    if (status >= 300 && status < 400) return "text-yellow-600 bg-yellow-100";
    if (status >= 400 && status < 500) return "text-orange-600 bg-orange-100";
    if (status >= 500) return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Response</h2>
        <div className="flex items-center space-x-4 text-sm">
          <span
            className={`px-2 py-1 rounded-md font-medium ${getStatusColor(
              response.status
            )}`}
          >
            {response.status} {response.statusText}
          </span>
          <span className="text-gray-500">{response.responseTime}ms</span>
          <span className="text-gray-500">
            {response.timestamp.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("body")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "body"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Response Body
          </button>
          <button
            onClick={() => setActiveTab("headers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "headers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Headers
          </button>
        </nav>
      </div>

      <div className="min-h-[200px]">
        {activeTab === "body" && (
          <div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
              <code>{formatJson(response.data)}</code>
            </pre>
          </div>
        )}

        {activeTab === "headers" && (
          <div>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex mb-2 text-sm">
                  <span className="font-medium text-blue-600 w-1/3">
                    {key}:
                  </span>
                  <span className="text-gray-700 flex-1 ml-2">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;
