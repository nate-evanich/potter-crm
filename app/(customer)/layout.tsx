export default function CustomerAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wizard-50 to-stone-100">{children}</div>
  );
}
