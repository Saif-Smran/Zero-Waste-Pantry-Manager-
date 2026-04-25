import usePageTitle from '../hooks/usePageTitle'

function AboutPage() {
  usePageTitle('About | Zero-Waste Pantry Manager')

  const aboutHero = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'
  const pantryImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500 mb-2">About this project</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why this app exists</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Zero-Waste Pantry Manager is built for people who want a practical way to manage home food inventory
            without clutter or unnecessary complexity. Instead of relying on memory, the app makes item status
            visible, sortable, and easy to act on.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            The goal is simple: reduce food waste, save money, and support better household planning. By identifying
            what to consume first, users can make quicker decisions and keep their pantry under control.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            This frontend experience includes public information pages, a private dashboard, a visual inventory
            chart, and quick search tools that stay fast on desktop and mobile.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img src={aboutHero} alt="Prepared ingredients and meal planning" className="h-64 w-full object-cover" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article className="bg-gray-900 text-white rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-2">Purpose</p>
              <h3 className="text-lg font-semibold mb-2">Make pantry decisions easier</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                The interface is designed so users can scan quickly, understand status, and take action without
                feeling overwhelmed.
              </p>
            </article>
            <article className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Focus</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple, useful, and fast</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The experience stays lightweight while still giving the dashboard, search, and profile areas enough
                personality to feel welcoming.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Home-based planning</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Small improvements in organization can have a large effect on what gets used, saved, or wasted.
          </p>
        </article>
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Clear visual cues</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            The dashboard and landing pages use simple colors and hierarchy so important items stand out quickly.
          </p>
        </article>
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Consistent daily habits</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tracking inventory regularly helps turn waste reduction into a repeatable habit, not a one-time task.
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200 mb-2">What the app encourages</p>
          <h3 className="text-2xl font-bold mb-4">Think before items disappear into the back of the fridge</h3>
          <p className="text-sm text-emerald-50 leading-relaxed mb-4">
            A better pantry experience is not just about storage. It is about awareness, timing, and making the next
            meal easier to choose. That is the idea behind the dashboard, charts, and item filtering.
          </p>
          <p className="text-sm text-emerald-50 leading-relaxed">
            The result is a smoother experience that helps users stay ahead of expiry dates and make more of what they
            already have.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
          <img src={pantryImage} alt="Organized pantry items" className="h-full min-h-[280px] w-full object-cover" />
        </div>
      </section>
    </div>
  )
}

export default AboutPage
