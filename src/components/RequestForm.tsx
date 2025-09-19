"use client";

import React, { useState } from "react";
import { HttpRequest, HttpResponse } from "../types";

interface RequestFormProps {
    onResponse: (response: HttpResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
    onResponse,
    loading,
    setLoading,
}) => {
    const [request, setRequest] = useState<HttpRequest>({
        method: "GET",
        url: "",
        headers: {},
        body: "",
    });

    const [headersText, setHeadersText] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let parsedHeaders: Record<string, string> = {};
            if (headersText.trim()) {
                try {
                    const headerLines = headersText
                        .split("\n")
                        .filter((line) => line.trim());
                    for (const line of headerLines) {
                        const [key, ...valueParts] = line.split(":");
                        if (key && valueParts.length > 0) {
                            parsedHeaders[key.trim()] = valueParts.join(":").trim();
                        }
                    }
                } catch (err) {
                    throw new Error(
                        'Invalid headers format. Use "Key: Value" format, one per line.'
                    );
                }
            }

            const requestData: HttpRequest = {
                ...request,
                headers: parsedHeaders,
            };

            const response = await fetch("/api/request", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result: HttpResponse = await response.json();
            onResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Request failed");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">HTTP Request</h2>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
                <select
                    value={request.method}
                    onChange={(e) =>
                        setRequest({ ...request, method: e.target.value as any })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>

                <input
                    type="url"
                    placeholder="Enter URL (e.g., https://api.example.com/users)"
                    value={request.url}
                    onChange={(e) => setRequest({ ...request, url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headers (Key: Value, one per line)
                </label>
                <textarea
                    placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
                    value={headersText}
                    onChange={(e) => setHeadersText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            </div>

            {(request.method === "POST" || request.method === "PUT") && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Body
                    </label>
                    <textarea
                        placeholder='{"key": "value"}'
                        value={request.body}
                        onChange={(e) => setRequest({ ...request, body: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={6}
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !request.url}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                {loading ? "Sending Request..." : "Send Request"}
            </button>
        </form>
    </div>
  );
};

export default RequestForm;
