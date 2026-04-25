import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import usePageTitle from '../hooks/usePageTitle'

function HomePage() {
  const { isAuthenticated } = useAuth()
  usePageTitle('Home | Zero-Waste Pantry Manager')

  const heroImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
  const prepImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'
  const produceImage = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-800 text-white shadow-2xl mb-8">
        <div className="absolute inset-0 opacity-30">
          <img
            src={heroImage}
            alt="Fresh pantry ingredients"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-gray-900/30" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10 lg:p-12 items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100 mb-4">
              Plan smarter, waste less
            </p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight max-w-xl">
              Turn your pantry into a calm, visual system that helps food last longer.
            </h2>
            <p className="text-sm sm:text-base text-gray-100 max-w-2xl leading-relaxed mt-5">
              Keep groceries visible, understand what needs attention first, and make faster decisions before food
              slips past its best date. The home page now gives visitors a clearer idea of how the app works and why
              it matters.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition"
                  >
                    Open Dashboard
                  </Link>
                  <Link
                    to="/inventory"
                    className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition"
                  >
                    Open Inventory
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="border border-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-2xl font-bold">01</p>
                <p className="text-xs text-gray-200 mt-1">Track inventory instantly</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-2xl font-bold">02</p>
                <p className="text-xs text-gray-200 mt-1">See expiry risk clearly</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-2xl font-bold">03</p>
                <p className="text-xs text-gray-200 mt-1">Act before food is wasted</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <img src={prepImage} alt="Fresh ingredients being prepared" className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">From groceries to meals</h3>
                <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                  Visual food tracking helps you see what can be cooked today, what should wait, and what needs to be
                  prioritized before the week ends.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm sm:hidden lg:block">
              <img src={produceImage} alt="Colorful pantry produce" className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">Fresh, organized, and waste-aware</h3>
                <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                  A clean layout and strong visual hierarchy make the app feel more inviting and easier to use from
                  the first visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Track by expiry</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            See which items are safe, nearing expiry, or already expired so your meal plan can adapt quickly.
          </p>
        </article>
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Act with confidence</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Update quantities as you consume items and keep your pantry inventory accurate in real time.
          </p>
        </article>
        <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Reduce waste habitually</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Build a weekly rhythm around high-priority foods and cut avoidable waste before it happens.
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200 mb-2">What you get</p>
          <h3 className="text-2xl font-bold mb-4">A smoother front door into the app</h3>
          <p className="text-sm text-gray-200 leading-relaxed mb-4">
            The home page now tells a fuller story: what the product does, why it is useful, and how it supports a
            more organized pantry routine. Visitors can understand the app before signing in.
          </p>
          <ul className="space-y-3 text-sm text-gray-100">
            <li>• Clear calls to action for login, registration, and dashboard access.</li>
            <li>• More visual balance with lifestyle photography and stronger contrast.</li>
            <li>• A tighter message focused on reducing waste and making meals easier to plan.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500 mb-2">How it helps</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Better awareness, better usage</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            When items are visible and easy to sort, households are more likely to use food in time. That means fewer
            last-minute surprises and fewer items wasted in the back of the fridge.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            The revised layout makes the hero feel more inviting while keeping the content practical and direct.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
