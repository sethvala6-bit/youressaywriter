export default function Home() {
  return (
    <main className="w-full">
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-dark mb-4">Your Essay Writer</h1>
          <p className="text-xl text-gray-600 mb-8">Professional Academic Writing Service</p>
          <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
