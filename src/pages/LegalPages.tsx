import { Seo } from "@/components/seo/Seo";

export function PrivacyPage() {
  return (
    <div className="container-page py-16">
      <Seo
        title="Privacy | Ink & Identity"
        description="How Ink & Identity stores enquiries and private artwork."
        path="/privacy"
      />
      <h1 className="display text-4xl sm:text-5xl md:text-6xl">Privacy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ivory/70">
        <p>
          Quote requests, contact details and uploaded artwork are stored in Convex so the studio can prepare a response. Artwork is private by default and is not shown on the public website.
        </p>
        <p>
          We do not sell personal information. Staff with admin or editor access can review enquiries in the protected studio. Replace this page with owner-approved legal copy before launch.
        </p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container-page py-16">
      <Seo
        title="Terms | Ink & Identity"
        description="Working terms for Ink & Identity quote requests."
        path="/terms"
      />
      <h1 className="display text-4xl sm:text-5xl md:text-6xl">Terms</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ivory/70">
        <p>
          Submitting an enquiry is a request for a quotation, not an order. Prices, lead times, printing methods and minimums are confirmed only in writing by the studio.
        </p>
        <p>Replace this placeholder with owner-approved terms before public launch.</p>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <Seo title="Page not found | Ink & Identity" description="This page does not exist on the Ink & Identity site." path="/404" noindex />
      <h1 className="display text-4xl sm:text-5xl md:text-6xl">This page is not here.</h1>
      <p className="mt-4 text-ivory/70">The link may have changed. Begin again from home, or send a quote.</p>
    </div>
  );
}
