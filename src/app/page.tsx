import Head from 'next/head';
import RequestClient from '../components/RequestClient';

export default function Home() {
  return (
    <>
      <Head>
        <title>REST Client - POSTMAN Alternative</title>
        <meta
          name="description"
          content="A REST client application for testing APIs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <h1 className="text-2xl font-bold text-gray-900">REST Client</h1>
              <p className="text-gray-600 mt-1">
                A powerful HTTP client for testing APIs with request history
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* RequestClient contains all client-side logic */}
          <RequestClient />
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500 text-sm">
              Built with Next.js, Bun, and MikroORM
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
