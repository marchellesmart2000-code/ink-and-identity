import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState, type FormEvent } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { AdminTable } from "./components/AdminTable";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  sortOrder: "0",
  published: true,
};

export function CategoriesAdminPage() {
  const categories = useQuery(api.collections.listCategoriesAdmin);
  const save = useMutation(api.collections.upsertCategory);
  const { push } = useToast();
  const [form, setForm] = useState(emptyForm);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await save({
        ...(form.id ? { id: form.id as Id<"categories"> } : {}),
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        published: form.published,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setForm(emptyForm);
      push(form.id ? "Category updated." : "Category added.");
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not save the category.", "error");
    }
  }

  return (
    <div>
      <h1 className="display text-5xl">Categories</h1>
      <p className="mt-3 max-w-xl text-sm text-ivory/70">
        Each published category gets its own shop page, a place in search, and a line in the sitemap.
      </p>
      <form className="mt-8 max-w-2xl space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="Generated from the name if empty" />
        <Textarea label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <Input label="SEO title" value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
        <Textarea label="SEO description" value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
        <Input label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} />
        <Checkbox label="Published" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
        <div className="flex gap-3">
          <Button type="submit">{form.id ? "Update category" : "Add category"}</Button>
          {form.id ? (
            <Button type="button" variant="line" onClick={() => setForm(emptyForm)}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
      <div className="mt-10">
        <AdminTable headers={["Name", "Slug", "Published", ""]}>
          {(categories ?? []).map((category) => (
            <tr key={category._id} className="border-t border-gold/20">
              <td className="px-4 py-3">{category.name}</td>
              <td className="px-4 py-3">{category.slug}</td>
              <td className="px-4 py-3">{category.published ? "Yes" : "Draft"}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="text-sm text-gold"
                  onClick={() =>
                    setForm({
                      id: category._id,
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      seoTitle: category.seoTitle ?? "",
                      seoDescription: category.seoDescription ?? "",
                      sortOrder: String(category.sortOrder),
                      published: category.published,
                    })
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
