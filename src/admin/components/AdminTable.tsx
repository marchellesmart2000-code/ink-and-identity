export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-gold/20">
      <table className="min-w-full text-left text-sm text-ivory/80">
        <thead className="bg-charcoal text-[0.62rem] uppercase tracking-[0.14em] text-gold">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
