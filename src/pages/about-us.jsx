// > Create a professional AboutUs React component for a digital banking web app. Use Tailwind CSS for styling. The page should include:
// > - A hero section with a headline, subheadline, and background image placeholder.
// > - A brief company history section with placeholder text.
// > - A section highlighting core values or mission with 3–4 cards (e.g. Security, Innovation, Transparency, Customer Focus).
// > - A section with 2–3 team member profile cards (name, title, placeholder image).
// > - Responsive layout for mobile and desktop
import React from 'react';
import Header from '../components/Header';

const coreValues = [
  {
    title: 'Security',
    desc: 'Bank-grade encryption, strict access controls and continuous monitoring to protect customer data.',
    icon: (
      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 1l9 4v6c0 6-3.8 11-9 12-5.2-1-9-6-9-12V5l9-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 11c1.2-2 4.8-2 6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: 'Innovation',
    desc: 'Modern APIs and frictionless UX that let customers move faster and build on our platform.',
    icon: (
      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 8l14 2-2 6-10 2-2-10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: 'Transparency',
    desc: 'Clear fees, simple terms, and proactive communication you can rely on.',
    icon: (
      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 3v18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: 'Customer Focus',
    desc: 'Design and support centered around real customer needs — fast help, clear options, empathy.',
    icon: (
      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 21c1.5-4 6-6 7-6s5.5 2 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const team = [
  { name: 'John Doe', title: 'Chief Technology Officer', img: 'https://via.placeholder.com/256', alt: 'John Doe portrait' },
  { name: 'Jane Smith', title: 'Head of Marketing', img: 'https://via.placeholder.com/256', alt: 'Jane Smith portrait' },
  { name: 'Alice Johnson', title: 'Customer Support Manager', img: 'https://via.placeholder.com/256', alt: 'Alice Johnson portrait' }
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />

      <main className="py-12 px-4 sm:px-6 lg:px-8 mt-12 mb-12">
        {/* HERO */}
        <section aria-label="About hero" className="">
          <div className="relative bg-white overflow-hidden mt-6">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none w-full shadow-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-2 ">	
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center gap-6">
                <span className="inline-block text-xs font-semibold uppercase text-primary/90 bg-primary/10 px-3 py-1 rounded-full">About Us</span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight max-w-2xl">
                  Banking built for people — secure, simple and human-centered
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground max-w-prose leading-relaxed">
                  Since 2020 we've built straightforward financial tools with enterprise-grade security and a focus on clarity. We design products that help customers manage money with confidence.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href="#our-history"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  >
                    Learn Our Story
                  </a>
                  <a
                    href="#values"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
                  >
                    Our Values
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">99.99%</div>
                    <div className="text-xs text-muted-foreground">uptime</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">24/7</div>
                    <div className="text-xs text-muted-foreground">support</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">2020</div>
                    <div className="text-xs text-muted-foreground">founded</div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-[420px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(https://via.placeholder.com/1200x800)' }}
                  role="img"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                <div className="absolute left-0 right-0 bottom-6">	
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-lg border border-slate-100">
                    <h4 className="text-sm sm:text-base font-semibold text-slate-900">What sets us apart</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Human-centered products, transparent pricing, and engineers who put privacy first.
                    </p>
                    <div className="mt-3 flex gap-3">
                      <a className="text-xs inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition" href="#contact">Talk to sales</a>
                      <a className="text-xs inline-flex items-center px-3 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition" href="#values">See values</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="my-12 border-t border-slate-100" />

        {/* COMPANY HISTORY */}
        <section id="our-history" className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Our History</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-prose">
                  We started with a simple mission: make banking accessible and trustworthy. Over the years we expanded features, hardened our security posture, and built an app and APIs that partners rely on.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">Security-first</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">API-ready</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">Customer-first</span>
                </div>
              </div>

              <div className="w-full lg:w-1/3">
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-primary">2020</div>
                    <div className="text-sm text-muted-foreground">Launched online accounts and payments.</div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-primary">2022</div>
                    <div className="text-sm text-muted-foreground">Released mobile app and developer APIs.</div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-primary">2024</div>
                    <div className="text-sm text-muted-foreground">Scaled security and support teams for enterprise reliability.</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section id="values" className="mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6">Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v) => (
              <article
                key={v.title}
                className="group p-6 rounded-lg bg-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col h-full"
                aria-labelledby={`val-${v.title}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h4 id={`val-${v.title}`} className="text-lg font-semibold">{v.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <a href="#contact" className="inline-flex items-center text-sm text-primary font-medium hover:underline">Learn more</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section aria-label="Team" className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold">Meet the Team</h3>
            <p className="text-sm text-muted-foreground hidden sm:block">Lean teams, fast decisions, strong execution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => (
              <div
                key={m.name}
                className="flex flex-col sm:flex-row items-start gap-4 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition h-full"
                role="article"
                aria-label={`${m.name} - ${m.title}`}
              >
                <img
                  src={m.img}
                  alt={m.alt}
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                  width="96"
                  height="96"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold">{m.name}</h4>
                      <p className="text-sm text-muted-foreground">{m.title}</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">Team</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground hidden sm:block">
                    Focused on delivering secure systems and exceptional customer outcomes.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
