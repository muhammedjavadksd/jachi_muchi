export const contactInfo = {
  phone: "0000-000-000",
  email: "care@example.com",
};

export const supportCards = [
{
    title: "About our products & services",
    description: "Questions about frames, lenses, orders, or store services.",
  },
  {
    title: "Returns & exchanges",
    description: "Need to adjust, exchange, or return an item you purchased.",
  },
  {
    title: "Account & orders",
    description: "Help with your account, payments, or order status.",
  },
];


 export const serviceLinks = [
  { label: "Warranty & FAQs", href: "/faq" },
  { label: "Chat with us on WhatsApp", href: `https://wa.me/${contactInfo.phone.replace(/-/g, '')}` },
  { label: "Write to customer care", href: `mailto:${contactInfo.email}` },
  { label: "Locate a nearby store", href: "/search?type=stores" },
];
