import { QuoteStepper } from "@/components/quote/QuoteStepper";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { resolveStudio } from "@/lib/studio";
import { enquiryWhatsappMessage, whatsappHref } from "@/lib/whatsapp";
import { publishedProducts } from "@/lib/catalogue";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const STEPS = [
  "Your details",
  "Who it is for",
  "What you need",
  "Pieces & quantities",
  "Design & timing",
  "Artwork",
  "Review",
];

export function QuotePage() {
  const settings = useSiteSettings();
  const products = useQuery(api.products.listPublic, {});
  const services = useQuery(api.services.listPublic);
  const generateUploadUrl = useMutation(api.files.generateQuoteUploadUrl);
  const submit = useMutation(api.quotes.submit);
  const { push } = useToast();
  const [params] = useSearchParams();
  const preProduct = params.get("product") ?? "";
  const preService = params.get("service") ?? "";

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: "business",
    needType: preService || "custom request",
    productSlug: preProduct,
    quantity: "1",
    details: "",
    brandNotes: "",
    deadline: "",
    budget: "",
    consent: false,
    honeypot: "",
  });

  const selectedProduct = useMemo(
    () =>
      publishedProducts().find((item) => item.slug === form.productSlug) ??
      products?.find((item) => item.slug === form.productSlug),
    [products, form.productSlug],
  );

  async function onSubmit() {
    if (form.honeypot.trim()) {
      setDone(true);
      return;
    }
    if (!form.consent) {
      push("Please confirm we may send this enquiry.", "error");
      return;
    }
    if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      push("Add your name and email so WhatsApp opens with the brief filled in.", "error");
      return;
    }
    const href = whatsappHref(
      resolveStudio(settings).whatsapp,
      enquiryWhatsappMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        customerType: form.customerType,
        needType: form.needType,
        productName: selectedProduct?.name,
        quantity: form.quantity,
        brandNotes: form.brandNotes,
        deadline: form.deadline,
        budget: form.budget,
        details: form.details,
        fileNames: files.map((file) => file.name),
      }),
    );
    if (!href) {
      push("The studio WhatsApp number is not linked yet.", "error");
      return;
    }
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await generateUploadUrl();
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const json = (await result.json()) as { storageId: string };
        uploaded.push({
          storageId: json.storageId as never,
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        });
      }
      await submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        customerType: form.customerType as
          | "business"
          | "school_team"
          | "event"
          | "personal"
          | "other",
        needType: form.needType,
        details: form.details,
        brandNotes: form.brandNotes,
        deadline: form.deadline,
        budget: form.budget,
        consent: form.consent,
        sourcePath: window.location.pathname + window.location.search,
        honeypot: form.honeypot,
        lines: [
          {
            label: selectedProduct?.name || form.needType,
            quantity: Number(form.quantity) || 1,
            notes: form.details,
            ...(selectedProduct && "_id" in selectedProduct && selectedProduct._id
              ? { productId: selectedProduct._id }
              : {}),
          },
        ],
        files: uploaded,
      });
    } catch {
      // WhatsApp still carries the brief if the studio record cannot be saved.
    }
    window.location.assign(href);
  }

  if (done) {
    return (
      <div className="container-page py-24 text-center">
        <Seo title="Quote sent | Ink & Identity" description="Your enquiry is with the studio." path="/quote" />
        <p className="eyebrow">Received</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl">Thank you.</h1>
        <p className="mx-auto mt-6 max-w-lg text-ivory/70">
          Your enquiry is with the studio. We will reply with the next clear step — never a fabricated timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <Seo
        title="Request a quote | Ink & Identity"
        description="A guided enquiry for custom apparel, branded merchandise and personalised gifts from Ink & Identity."
        path="/quote"
      />
      <p className="eyebrow">Enquiry</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">Start a project</h1>
      <QuoteStepper step={step} total={STEPS.length} label={STEPS[step] ?? ""} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="mt-10 space-y-6"
        >
          {step === 0 ? (
            <>
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="hidden">
                <Input label="Company website" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} tabIndex={-1} autoComplete="off" />
              </div>
            </>
          ) : null}
          {step === 1 ? (
            <Select
              label="Customer type"
              value={form.customerType}
              onChange={(e) => setForm({ ...form, customerType: e.target.value })}
            >
              <option value="business">Business</option>
              <option value="school_team">School / team</option>
              <option value="event">Event</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </Select>
          ) : null}
          {step === 2 ? (
            <Select
              label="What you need"
              value={form.needType}
              onChange={(e) => setForm({ ...form, needType: e.target.value })}
            >
              <option value="apparel">Apparel</option>
              <option value="gifts">Gifts</option>
              <option value="corporate branding">Corporate branding</option>
              <option value="drinkware">Drinkware</option>
              <option value="stationery">Stationery</option>
              <option value="event merchandise">Event merchandise</option>
              <option value="custom request">Custom request</option>
              {(services ?? []).map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </Select>
          ) : null}
          {step === 3 ? (
            <>
              <Select
                label="Product (optional)"
                value={form.productSlug}
                onChange={(e) => setForm({ ...form, productSlug: e.target.value })}
              >
                <option value="">A custom request</option>
                {publishedProducts().map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.categoryName} — {product.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </>
          ) : null}
          {step === 4 ? (
            <>
              <Textarea
                label="Brand / design notes"
                value={form.brandNotes}
                onChange={(e) => setForm({ ...form, brandNotes: e.target.value })}
              />
              <Input
                label="Deadline (if you have one)"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
              <Input
                label="Budget (optional — this is not a price promise)"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
              <Textarea
                label="Anything else"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
              />
            </>
          ) : null}
          {step === 5 ? (
            <FileUpload
              label="Artwork (optional, private)"
              hint="JPEG, PNG, WebP, SVG or PDF · up to 10MB each"
              files={files}
              onChange={setFiles}
            />
          ) : null}
          {step === 6 ? (
            <>
              <div className="rounded-sm border border-gold/25 bg-charcoal p-6 text-sm leading-relaxed text-ivory/80">
                <p>
                  {form.name} · {form.email}
                </p>
                <p className="mt-2">
                  {form.customerType} · {form.needType} · qty {form.quantity}
                </p>
                {selectedProduct ? <p className="mt-2">{selectedProduct.name}</p> : null}
              </div>
              <Checkbox
                label={settings?.privacyConsentCopy ?? "I agree that the studio may store this enquiry."}
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              />
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 flex gap-3">
        {step > 0 ? (
          <Button variant="line" type="button" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={() => void onSubmit()}>
            Send on WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
