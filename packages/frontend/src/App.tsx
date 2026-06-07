
// A temporary placeholder UI element until we build out our pages directory
export const App = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
          Kindness Tracker
        </h1>
        <p className="mb-6 text-slate-600">
          Your full-stack monorepo workspace is officially wired and ready for feature building!
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500"></span>
          Shared Contract Active
        </div>
      </div>
    </div>
  );
};
