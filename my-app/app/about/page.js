export const metadata = {
  title: "About",
  description: "RemoteWorkNaija connects Nigerian professionals to global remote opportunities.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-blue-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About RemoteWorkNaija</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Connecting Nigerian professionals to global remote opportunities — one job at a time.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          RemoteWorkNaija was built to close the gap between Nigeria's enormous pool of skilled professionals
          and the global remote job market. We aggregate thousands of live remote jobs from top platforms and
          surface the ones that matter most to you — filtered, personalized, and delivered in real time.
        </p>
      </section>

      {/* What we do */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Aggregate Jobs", desc: "We pull live listings from Remotive, WeWorkRemotely, and more — updated daily." },
              { title: "Smart Alerts", desc: "Set keyword alerts and get notified the moment a matching job is posted." },
              { title: "Employer Tools", desc: "Nigerian employers can post jobs directly and reach thousands of qualified candidates." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find your next remote role?</h2>
        <a href="/jobs"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition">
          Browse Jobs
        </a>
      </section>
    </main>
  );
}
