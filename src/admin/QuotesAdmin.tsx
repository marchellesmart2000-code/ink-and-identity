import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminTable } from "./components/AdminTable";
import { formatDate, quoteStatusCopy } from "@/lib/format";
import type { Id } from "../../convex/_generated/dataModel";

const statuses = [
  "new",
  "reviewing",
  "quoted",
  "approved",
  "in_production",
  "completed",
  "archived",
] as const;

export function QuotesAdminPage() {
  const [status, setStatus] = useState("");
  const quotes = useQuery(api.quotes.listAdmin, {
    status: status ? (status as (typeof statuses)[number]) : undefined,
  });
  return (
    <div>
      <h1 className="display text-5xl">Quote inbox</h1>
      <div className="mt-6 max-w-xs">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {quoteStatusCopy[item]}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-8">
        <AdminTable headers={["Name", "Need", "Status", "Date", ""]}>
          {(quotes ?? []).map((quote) => (
            <tr key={quote._id} className="border-t border-gold/20">
              <td className="px-4 py-3">{quote.name}</td>
              <td className="px-4 py-3">{quote.needType}</td>
              <td className="px-4 py-3">
                <StatusBadge status={quote.status} />
              </td>
              <td className="px-4 py-3">{formatDate(quote.createdAt)}</td>
              <td className="px-4 py-3">
                <Link to={`/admin/quotes/${quote._id}`} className="text-gold">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

export function QuoteDetailAdminPage() {
  const { id = "" } = useParams();
  const quote = useQuery(api.quotes.getAdmin, {
    id: id as Id<"quoteRequests">,
  });
  const updateStatus = useMutation(api.quotes.updateStatus);
  const addNote = useMutation(api.quotes.addNote);
  const [note, setNote] = useState("");
  if (quote === undefined) {
    return <p>Loading…</p>;
  }
  if (!quote) {
    return <EmptyState title="Not found" body="This enquiry is no longer available." />;
  }
  return (
    <div className="max-w-3xl">
      <h1 className="display text-5xl">{quote.name}</h1>
      <p className="mt-2 text-sm text-ivory/70">
        {quote.email} · {quote.phone || "No phone"} · {quote.customerType}
      </p>
      <p className="mt-4">{quote.needType}</p>
      <p className="mt-2 text-sm text-ivory/70">{quote.details}</p>
      <p className="mt-2 text-sm">Budget: {quote.budget || "Not given"}</p>
      <p className="mt-2 text-sm">Deadline: {quote.deadline || "Not given"}</p>
      <div className="mt-6 max-w-xs">
        <Select
          label="Status"
          value={quote.status}
          onChange={(e) =>
            void updateStatus({
              id: quote._id,
              status: e.target.value as (typeof statuses)[number],
            })
          }
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {quoteStatusCopy[item]}
            </option>
          ))}
        </Select>
      </div>
      <h2 className="display mt-10 text-3xl">Artwork</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {quote.files.map((file) => (
          <li key={file._id}>
            {file.url ? (
              <a href={file.url} className="text-gold" target="_blank" rel="noreferrer">
                {file.fileName}
              </a>
            ) : (
              file.fileName
            )}
          </li>
        ))}
        {quote.files.length === 0 ? <li>No files</li> : null}
      </ul>
      <h2 className="display mt-10 text-3xl">Internal notes</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {quote.internalNotes.map((item) => (
          <li key={item.createdAt}>
            <strong>{item.authorName}</strong>: {item.body}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Textarea label="Add a note" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button
          className="mt-3"
          onClick={async () => {
            await addNote({ id: quote._id, body: note });
            setNote("");
          }}
        >
          Save note
        </Button>
      </div>
    </div>
  );
}
