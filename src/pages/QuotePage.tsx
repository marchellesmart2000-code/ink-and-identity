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
import { QUOTE_CATEGORIES, quoteCategoryName } from "@/lib/constants";
import { publishedProduct } from "@/lib/catalogue";
import { enquiryWhatsappMessage, whatsappHref } from "@/lib/whatsapp";
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
  const services = useQuery(api.services.listPublic);
  const generateUploadUrl = useMutation(api.files.generateQuoteUploadUrl);
  const submit = useMutation(api.quotes.submit);
  const { push } = useToast();
  const [params] = useSearchParams();
  const preProduct = params.get("product") ?? "";
  const preService = params.get("service") ?? "";
  const preCategory = useMemo(() => {
    if (!preProduct) {
      return "";
    }
    const product = publishedProduct(preProduct);
    if (!product) {
      return "";
    }
    const normalized = product.categoryName.toLowerCase();
    return (
      QUOTE_CATEGORIES.find(
        (category) =>
          category.name.toLowerCase() === normalized ||
          normalized.includes(category.name.toLowerCase()),
      )?.slug ?? ""
    );
  }, [preProduct]);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: "business",
    needType: preService || "custom request",
    productCategory: preCategory || QUOTE_CATEGORIES[0].slug,
    quantity: "1",
    details: "",
    brandNotes: "",
    deadline: "",
    budget: "",
    consent: false,
    honeypot: "",
  });

  const selectedCategoryName = quoteCategoryName(form.productCategory);

  const studio = resolveStudio(settings);
  const whatsappMessage = useMemo(
    () =>
      enquiryWhatsappMessage({
        brandName: settings?.brandName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        customerType: form.customerType,
        needType: form.needType,
        productName: selectedCategoryName,
        quantity: form.quantity,
        brandNotes: form.brandNotes,
        deadline: form.deadline,
        budget: form.budget,
        details: form.details,
        fileNames: files.map((file) => file.name),
      }),
    [settings?.brandName, form, selectedCategoryName, files],
  );
  const whatsappLink = useMemo(
    () => whatsappHref(studio.whatsapp, whatsappMessage),
    [studio.whatsapp, whatsappMessage],
  );

  async function saveQuoteInBackground() {
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
            label: selectedCategoryName || form.needType,
            quantity: Number(form.quantity) || 1,
            notes: form.details,
          },
        ],
        files: uploaded,
      });
    } catch {
      // WhatsApp still carries the brief if the studio record cannot be saved.
    }
  }

  function onSendQuoteClick() {
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
    if (!whatsappLink) {
      push("The studio WhatsApp number is not linked yet.", "error");
      return;
    }
    void saveQuoteInBackground();
    window.location.href = whatsappLink;
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
                label="Product category"
                value={form.productCategory}
                onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
              >
                {QUOTE_CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
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
                <p className="eyebrow">WhatsApp message preview</p>
                <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ivory/85">
                  {whatsappMessage}
                </pre>
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
          <Button type="button" onClick={onSendQuoteClick}>
            Request a quote
          </Button>
        )}
      </div>
    </div>
  );
}
