import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const INFO_CONTENT = {
  about: {
    title: 'About Nitya Yantra',
    subtitle: 'Smart Gadgets & Products for Everyday Life',
    icon: HelpCircle,
    content: (
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        <p>
          Welcome to <strong>Nitya Yantra</strong>. We are an independent product discovery platform created to help Indian shoppers discover useful gadgets, kitchen tools, smart electronics, and practical everyday essentials in one clean, uncluttered place.
        </p>
        <div className="p-5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
          <h3 className="font-extrabold text-sky-950 text-base">Our Purpose</h3>
          <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
            Shopping online often involves jumping across multiple marketplace apps and wading through thousands of low-quality listings. We manually curate products, display direct marketplace links with real pricing, and make it easy to choose where to buy.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">How Nitya Yantra Works</h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Discover:</strong> Browse curated products across categories like Kitchen & Dining, Home, and Gadgets.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Compare Prices:</strong> View verified selling prices across leading Indian marketplaces like Amazon, Flipkart, Meesho, and Myntra.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Buy Directly:</strong> Click directly to your preferred marketplace to complete your order safely and securely.</span>
            </li>
          </ul>
        </div>
        <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
          Nitya Yantra is not a seller or retailer. All purchases and deliveries are fulfilled directly by the respective marketplaces.
        </p>
      </div>
    ),
  },

  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    subtitle: 'Our Commitment to Transparency & Honest Recommendations',
    icon: ShieldCheck,
    content: (
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
          <h3 className="font-extrabold text-amber-950 text-base">Full Disclosure Statement</h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Nitya Yantra is a product discovery and affiliate website. Some links on this website are affiliate links, which means we may earn a commission if you make a qualifying purchase through those links, at no additional cost to you.
          </p>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-bold">
            "As an Amazon Associate I earn from qualifying purchases."
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">Pricing & Availability Disclaimer</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Prices, availability, offers and product information may change on the marketplace websites. Please check the final price and product details on the marketplace before purchasing.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We do not inflate prices or charge any fees for using Nitya Yantra. When you purchase through our links, the price you pay is the exact same price (or discounted offer) available directly on the store.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-base">Editorial Independence</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Products featured on Nitya Yantra are curated based on product utility, quality, and real value for everyday Indian households. Marketplaces do not dictate which products we feature or recommend.
          </p>
        </div>
      </div>
    ),
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How We Respect and Protect Your Privacy',
    icon: FileText,
    content: (
      <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
        <p>
          At <strong>Nitya Yantra</strong>, we respect your privacy. This Privacy Policy outlines what information is collected when you visit our website.
        </p>
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">1. Information We Do NOT Collect</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Nitya Yantra does not require user registration, login, or personal profile creation for browsing. We do not collect credit card numbers, bank details, or payment information because all transactions occur directly on third-party marketplace websites.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">2. Outbound Links & Third-Party Cookies</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            When you click on a store link (such as Amazon, Flipkart, Meesho, or Myntra), you leave Nitya Yantra and navigate to the external merchant. Those partner platforms may set tracking cookies to credit qualifying affiliate purchases. Please review the privacy policies of the respective merchants for details on their data handling.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">3. Analytics & Technical Logs</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Like most websites, our servers may log standard technical data such as browser type, device information, and anonymous visit counts to maintain website speed, security, and performance.
          </p>
        </div>
      </div>
    ),
  },

  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Usage Guidelines for Nitya Yantra',
    icon: FileText,
    content: (
      <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
        <p>
          By accessing and using <strong>Nitya Yantra</strong>, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-base">1. Informational & Discovery Service</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Nitya Yantra is an informational catalog and product discovery tool. We do not manufacture, warehouse, sell, package, or ship any products listed on this website.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-base">2. Marketplace Transactions</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            All purchases, returns, warranty claims, and shipping inquiries are handled exclusively by the respective marketplace (e.g. Amazon, Flipkart, etc.) where your order was placed, subject to that merchant's terms of service.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-base">3. Accuracy of Listings</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            While we strive to keep prices and product availability accurate, merchants frequently adjust prices and stock levels without prior notice. Always verify specifications, warranties, and final prices on the store website before ordering.
          </p>
        </div>
      </div>
    ),
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'Questions, Feedback or Product Suggestions',
    icon: Mail,
    content: (
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        <p>
          Have a question about a product, feedback on the website, or a suggestion for useful everyday gadgets we should feature? We would love to hear from you.
        </p>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 max-w-md">
          <div className="flex items-center gap-3 text-slate-900 font-bold">
            <Mail className="w-5 h-5 text-sky-600" />
            <span>Email Inquiries</span>
          </div>
          <p className="text-xs text-slate-600">
            For editorial suggestions, partnership queries, or general questions, please reach out to us at:
          </p>
          <a
            href="mailto:contact@nityayantra.com"
            className="inline-block font-mono font-bold text-sky-600 hover:text-sky-700 text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200"
          >
            contact@nityayantra.com
          </a>
        </div>
      </div>
    ),
  },
};

export const InfoPage = ({ pageKey }) => {
  const location = useLocation();
  const currentKey = pageKey || location.pathname.replace(/^\//, '') || 'about';
  const data = INFO_CONTENT[currentKey] || INFO_CONTENT.about;
  const IconComp = data.icon || FileText;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentKey]);

  return (
    <PageContainer className="pt-4 pb-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-5">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{data.title}</span>
      </nav>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <IconComp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Content */}
        <div>{data.content}</div>

        {/* Back to Products CTA */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Looking for recommended products?
          </span>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </PageContainer>
  );
};

export default InfoPage;
