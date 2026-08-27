import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminTable } from "./components/AdminTable";
import { ImageUploader } from "./components/ImageUploader";
import type { Id } from "../../convex/_generated/dataModel";

export function ProductsAdminPage() {
  const products = useQuery(api.products.listAdmin);
  const archive = useMutation(api.products.archive);
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="display text-5xl">Products</h1>
        <Button href="/admin/products/new">New product</Button>
      </div>
      <div className="mt-8">
        <AdminTable headers={["Name", "Status", "Availability", ""]}>
          {(products ?? []).map((product) => (
            <tr key={product._id} className="border-t border-gold/20">
              <td className="px-4 py-3">
                <Link to={`/admin/products/${product._id}`} className="hover:text-gold">
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-3">{product.published ? "Published" : "Draft"}</td>
              <td className="px-4 py-3">{product.availability}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="text-sm text-gold"
                  onClick={() => void archive({ id: product._id, archived: !product.archived })}
                >
                  {product.archived ? "Restore" : "Archive"}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}

export function ProductEditorPage() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const existing = useQuery(api.products.getAdmin, isNew || !id ? "skip" : { id: id as Id<"products"> });
  const categories = useQuery(api.collections.listCategoriesAdmin);
  const collections = useQuery(api.collections.listAdmin);
  const services = useQuery(api.services.listAdmin);
  const create = useMutation(api.products.create);
  const update = useMutation(api.products.update);
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<Array<{ storageId: Id<"_storage">; alt: string; sortOrder: number }>>([]);

  const source = existing ?? null;
  const value = (key: string, fallback = "") => form[key] ?? String(source?.[key as keyof typeof source] ?? fallback);

  async function save() {
    const categoryId = (form.categoryId || source?.categoryId || categories?.[0]?._id) as Id<"categories">;
    const payload = {
      name: value("name"),
      slug: value("slug"),
      shortDescription: value("shortDescription"),
      longDescription: value("longDescription"),
      categoryId,
      collectionIds: source?.collectionIds ?? [],
      serviceIds: source?.serviceIds ?? [],
      tags: value("tags")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      productType: value("productType", "custom"),
      personalizationOptions: value("personalizationOptions")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      brandCollection: value("brandCollection"),
      sku: value("sku"),
      gallery: gallery.length ? gallery : source?.gallery?.map((item, index) => ({
        storageId: item.storageId,
        alt: item.alt,
        sortOrder: index,
      })) ?? [],
      currency: "ZAR",
      priceDisplay: (value("priceDisplay", "request_quote") as "show_price" | "request_quote" | "hidden"),
      availability: (value("availability", "available_to_quote") as
        | "available_to_quote"
        | "made_to_order"
        | "limited"
        | "temporarily_unavailable"
        | "archived"),
      leadTime: value("leadTime"),
      featured: value("featured", source?.featured ? "true" : "false") === "true",
      newArrival: source?.newArrival ?? false,
      specifications: source?.specifications ?? [],
      careInstructions: value("careInstructions"),
      options: source?.options ?? [],
      seoTitle: value("seoTitle") || value("name"),
      seoDescription: value("seoDescription") || value("shortDescription"),
      published: value("published", source?.published ? "true" : "false") === "true",
      sortOrder: Number(value("sortOrder") || source?.sortOrder || 0),
    };
    try {
      if (isNew) {
        const created = await create(payload);
        navigate(`/admin/products/${created}`);
      } else {
        await update({ id: id as Id<"products">, ...payload });
      }
      push("Product saved.");
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not save.", "error");
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="display text-5xl">{isNew ? "New product" : source?.name ?? "Product"}</h1>
      <Input label="Name" value={value("name")} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Slug" value={value("slug")} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <Textarea label="Short description" value={value("shortDescription")} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
      <Textarea label="Long description" value={value("longDescription")} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} />
      <Select label="Category" value={value("categoryId", String(source?.categoryId ?? ""))} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
        {(categories ?? []).map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Input label="SKU" value={value("sku")} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
      <Input label="Tags (comma)" value={value("tags", source?.tags.join(", ") ?? "")} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      <Select label="Price display" value={value("priceDisplay", source?.priceDisplay ?? "request_quote")} onChange={(e) => setForm({ ...form, priceDisplay: e.target.value })}>
        <option value="request_quote">Request a quote</option>
        <option value="show_price">Show price</option>
        <option value="hidden">Hide price</option>
      </Select>
      <Select label="Availability" value={value("availability", source?.availability ?? "available_to_quote")} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
        <option value="available_to_quote">Available to quote</option>
        <option value="made_to_order">Made to order</option>
        <option value="limited">Limited</option>
        <option value="temporarily_unavailable">Temporarily unavailable</option>
      </Select>
      <Input label="Lead time text" value={value("leadTime")} onChange={(e) => setForm({ ...form, leadTime: e.target.value })} />
      <Input label="SEO title" value={value("seoTitle")} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
      <Textarea label="SEO description" value={value("seoDescription")} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
      <ImageUploader
        label="Add gallery image"
        onUploaded={(storageId, alt) =>
          setGallery((current) => [...current, { storageId, alt, sortOrder: current.length }])
        }
      />
      <Checkbox
        label="Published"
        checked={value("published", source?.published ? "true" : "false") === "true"}
        onChange={(e) => setForm({ ...form, published: String(e.target.checked) })}
      />
      <Checkbox
        label="Featured"
        checked={value("featured", source?.featured ? "true" : "false") === "true"}
        onChange={(e) => setForm({ ...form, featured: String(e.target.checked) })}
      />
      <Button onClick={() => void save()}>Save</Button>
      <p className="text-xs text-ivory/55">{collections?.length} collections · {services?.length} services available to attach later.</p>
    </div>
  );
}
