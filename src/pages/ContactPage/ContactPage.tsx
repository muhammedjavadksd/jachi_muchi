import { memo, useMemo, useState } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";
import { supportCards, serviceLinks, contactInfo } from "@/data/contact.data";
import { submitContactMessage } from "../../api/contact";
const HEADER_SPACER_HEIGHT = 140;



/**
 * Contact page – provides multiple ways for customers to reach support
 */
export const ContactPage = memo(function ContactPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      // prefer toast if available, fallback to alert
      try {
        const t = await import("react-hot-toast");
        t.toast.error("Please fill name, email and message fields.");
      } catch {
        alert("Please fill name, email and message fields.");
      }
      return;
    }

    setIsLoading(true);
    try {
      await submitContactMessage(form);
      try {
        const t = await import("react-hot-toast");
        t.toast.success("Message sent. We'll get back to you soon.");
      } catch {
        alert("Message sent. We'll get back to you soon.");
      }
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      try {
        const t = await import("react-hot-toast");
        t.toast.error("Failed to send message. Please try again.");
      } catch {
        alert("Failed to send message. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Page heading */}
          <section className="text-center space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-teal-600">
              Contact
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              We&apos;re here to help you see better
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Choose the option that best matches your enquiry and our team will
              get back to you as soon as possible.
            </p>
          </section>

          {/* Top support categories */}
          <section className="grid gap-6 md:grid-cols-3">
            {supportCards.map((card, index) => (
              <article
                key={`${card.title}-${index}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center px-6 py-8"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <span className="text-2xl" aria-hidden>
                    ●
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  {card.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {card.description}
                </p>
              </article>
            ))}
          </section>

          {/* Phone contact */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Prefer to talk?
              </p>
              <p className="mt-1 text-base sm:text-lg text-gray-800">
                Call our customer care team during support hours.
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Monday to Sunday, 9:00 AM – 9:00 PM
              </p>
            </div>
            <div className="text-left sm:text-right">
              <a
                href={`tel:${contactInfo.phone.replace(/-/g, '')}`}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-lg sm:text-2xl font-semibold tracking-wide text-gray-900 hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                {contactInfo.phone}
              </a>
              <p className="mt-2 text-[11px] text-gray-500">
                Standard call charges may apply.
              </p>
            </div>
          </section>

          {/* About our products & services */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M12 4.5C7.30558 4.5 3.5 7.30558 3.5 11C3.5 14.6944 7.30558 17.5 12 17.5C16.6944 17.5 20.5 14.6944 20.5 11C20.5 7.30558 16.6944 4.5 12 4.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9.75 10.75L11.25 12.25L14.25 9.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  About our products &amp; services
                </h2>
                <p className="text-sm text-gray-600">
                  Find quick answers or choose how you would like to reach us.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {serviceLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-800 hover:border-teal-500 hover:bg-teal-50/40 transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    →
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Recruitment and careers */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <article className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-7 space-y-4">
              <header className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M12 12C13.933 12 15.5 10.433 15.5 8.5C15.5 6.567 13.933 5 12 5C10.067 5 8.5 6.567 8.5 8.5C8.5 10.433 10.067 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 19C6.74029 17.3741 8.5615 15.5 12 15.5C15.4385 15.5 17.2597 17.3741 18 19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Recruitment &amp; careers
                  </h2>
                  <p className="text-sm text-gray-600">
                    Interested in joining our team or have hiring-related questions?
                  </p>
                </div>
              </header>

              <dl className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Contact person
                  </dt>
                  <dd>People &amp; Culture Team</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Email
                  </dt>
                  <dd>
                    <a
                      href="mailto:careers@example.com"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      careers@example.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href="tel:0000000001"
                      className="text-gray-800 hover:text-teal-700"
                    >
                      0000-000-001
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Office
                  </dt>
                  <dd>Vision Plaza, Level 4, City Centre</dd>
                </div>
              </dl>

              <div>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  Visit careers site
                  <span className="ml-2" aria-hidden>
                    ↗
                  </span>
                </a>
              </div>
            </article>

            <article className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-7 space-y-4">
              <header className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M4.75 7.75L10.7215 11.5599C11.492 12.0355 12.508 12.0355 13.2785 11.5599L19.25 7.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="4.75"
                      y="5"
                      width="14.5"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Media &amp; PR enquiries
                  </h2>
                  <p className="text-sm text-gray-600">
                    For press, partnerships, or public relations requests.
                  </p>
                </div>
              </header>

              <div className="pt-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Email
                </p>
                <a
                  href="mailto:press@example.com"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 break-all"
                >
                  press@example.com
                </a>
              </div>
            </article>
          </section>

          {/* Send us a message (contact form) */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-7">
            <header className="mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Send us a message
              </h2>
              <p className="text-sm text-gray-600">Have a question? Drop us a message and we'll get back to you.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
                    </svg>
                  ) : (
                    'Send message'
                  )}
                </button>
              </div>
            </form>
          </section>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

ContactPage.displayName = "ContactPage";

