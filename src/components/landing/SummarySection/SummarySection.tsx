export function SummarySection() {
  return (
    <div className="w-full pb-16">
      <div className="w-full mx-auto max-w-screen-lg">
        <h2 className="text-2xl text-center font-landing">
          From individuals to bustling startups, Formcraft is the intuitive
          solution for anyone needing to collect data efficiently and
          affordably.
        </h2>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mt-12">
          <div className="p-8 bg-amber-50 text-foreground rounded-3xl">
            <h3 className="text-2xl font-landing-secondary">
              🔀 Smart logic & flow
            </h3>
            <p className="mt-2">
              Use optional adaptable logic to create anything from basic
              pathways to complex quizzes, ensuring an engaging and tailored
              user experience.
            </p>
          </div>
          <div className="p-8 bg-blue-50 text-foreground rounded-3xl">
            <h3 className="text-2xl font-landing-secondary">
              🎨 Style it your way
            </h3>
            <p className="mt-2">
              Choose from pre-made themes or unleash your creativity by
              designing custom themes that echo your brand’s unique vibe.
            </p>
          </div>
          <div className="p-8 bg-slate-100 text-foreground rounded-3xl">
            <h3 className="text-2xl font-landing-secondary">
              🤝 Collaborate smoothly
            </h3>
            <p className="mt-2">
              Bring your team together to create, manage, and review forms
              effortlessly. Perfect for teamwork that gets things done without
              the hassle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
