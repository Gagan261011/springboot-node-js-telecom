export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-b from-transparent to-[var(--bg-muted)]/80 py-10 text-sm text-ink-600 transition dark:text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-ink-900 dark:text-white">
            &copy; {new Date().getFullYear()} Connectify Telecom
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-brand-600/70 dark:text-white/50">
            Crafted for seamless connectivity
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
          <a
            href="#plans"
            className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:hover:text-white"
          >
            Plans
          </a>
          <a
            href="#support"
            className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:hover:text-white"
          >
            Support
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-500 dark:border-white/10 dark:hover:text-white"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
