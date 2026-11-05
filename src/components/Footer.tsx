export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary border-t border-line py-8">
      <div className="container-x flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">© {year} Ivar Delos Santos</p>
        <p className="text-xs text-muted">Malolos, Bulacan, Philippines</p>
      </div>
    </footer>
  );
}