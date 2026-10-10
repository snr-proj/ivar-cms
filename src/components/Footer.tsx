export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary border-t border-line py-8">
      <div className="max-w-container mx-auto px-6 md:px-10 flex items-center justify-between">
        <p className="text-xs text-muted">© {year} Ivar Delos Santos</p>
        <p className="text-xs text-muted">Malolos, Bulacan, Philippines</p>
      </div>
    </footer>
  );
}
