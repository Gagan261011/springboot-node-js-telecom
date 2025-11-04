export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Connectify Telecom. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#plans" className="hover:text-primary">
            Plans
          </a>
          <a href="#support" className="hover:text-primary">
            Support
          </a>
          <a href="#contact" className="hover:text-primary">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
