import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { useLoginModal } from "../../context/LoginModalContext";

const HEADER_SPACER_HEIGHT = 140;

const SIX_SIGNS = [
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/Eye.svg", text1: "Bright Light", text2: "Discomfort" },
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/EyeWithDrop.svg", text1: "Water Eyes", text2: "Discomfort" },
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/PersonTwo.svg", text1: "Frequent", text2: "Neck Pain" },
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/Person.svg", text1: "Frequent", text2: "Headeches" },
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/A_char.svg", text1: "Difficulty", text2: "Reading" },
  { icon: "https://static.lenskart.com/media/desktop/img/HTO/EyeMulti.svg", text1: "Hazy", text2: "Vision" },
];

const FAQS = [
  { question: "What is Lenskart Home Eye Test?", answer: "Lenskart Home Eye Test is a convenient service where our certified professionals visit your home to conduct a comprehensive eye check-up." },
  { question: "Why Should I Opt for the Lenskart Home Eye Test?", answer: "It's convenient, hassle-free, and done by certified professionals in the comfort of your home." },
  { question: "What Cities Is this Service Available In?", answer: "This service is available in major cities across India. Please check availability for your location." },
  { question: "Where to Go for an Eye Check-Up?", answer: "You can either visit our stores or book a home eye test appointment." },
  { question: "How Much Does the Lenskart Eye Check Up Cost?", answer: "The home eye test starts at just ₹99." },
  { question: "How to Test Eye Power at Home?", answer: "Book a home eye test appointment and our certified professionals will conduct a 12-step eye check-up at your home." },
  { question: "How to Check Your Eyesight at Home?", answer: "Simply book an appointment through our website and our team will visit your home." },
  { question: "How to Check the Eye Number at Home?", answer: "Our professional eye test includes all the necessary checks to determine your eye number." },
];

const REVIEWS = [
  { name: "Neha Kapoor", rating: 5, comment: "Top-notch service, convenient and accurate." },
  { name: "Mohan Joshi", rating: 4, comment: "Quality check-up at home. Highly recommended!" },
];

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill={filled ? "#0FBD95" : "none"} stroke={filled ? "#0FBD95" : "#0FBD95"} strokeWidth="1">
    <path d="m12 .587 3.668 7.568L24 9.306l-6.064 5.828 1.48 8.279L12 19.446l-7.417 3.967 1.481-8.279L0 9.306l8.332-1.151z" />
  </svg>
);

export const HomeTryOnPage = memo(function HomeTryOnPage(): JSX.Element {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { open: openLogin } = useLoginModal();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleBookAppointment = useCallback(() => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    navigate("/home-try-on/book");
  }, [isAuthenticated, openLogin, navigate]);

  const spacerStyle = { height: `${HEADER_SPACER_HEIGHT}px` };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container className="max-w-7xl">
          {/* Main Content - Desktop Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8 py-8">
            {/* Left Side - Video */}
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                  poster="https://static.lenskart.com/media/desktop/img/DesignStudioIcons/HTO_video_placeholder.png"
                >
                  <source src="https://static.lenskart.io/video/yt-videos/EyeTest-Square-LK@Home.mp4#t=0.1" type="video/mp4" />
                </video>
              </div>

              {/* Six Signs Section */}
              <div className="mt-10">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900">6</span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-2">Signs you need an eyetest</h2>
                </div>

                {/* Carousel dots/page indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all ${i === 0 ? "w-16 bg-teal-600" : "w-16 bg-gray-300"}`}
                    />
                  ))}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {SIX_SIGNS.map((sign, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                      <img src={sign.icon} alt="icon" className="w-10 h-10 mx-auto mb-3" />
                      <p className="text-sm text-gray-900">{sign.text1}</p>
                      <p className="text-sm text-gray-600">{sign.text2}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">FAQs About Home Eye Tests</h2>
                <div className="space-y-3">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-teal-600 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === index && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help / Chat with Us */}
              <div className="mt-10 flex items-center justify-between bg-gray-50 rounded-xl p-6">
                <div>
                  <p className="font-semibold text-gray-900">Need more help</p>
                </div>
                <a
                  href="https://api.whatsapp.com/send/?phone=918447821891&text=Need%20help%20with%20Lenskart%20at-home%20appointment"
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  <span>Chat with us</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Rating & Reviews */}
              <div className="mt-10">
                {/* <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rating & Reviews</h2> */}
                
                {/* Overall Rating */}
                {/* <div className="flex items-center gap-1 mb-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} filled={i < 4} />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">4.9</span>
                  <span className="text-gray-500">(17k)</span>
                </div> */}

                {/* Reviews List */}
                {/* <div className="space-y-6">
                  {REVIEWS.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <StarIcon key={i} filled={i < review.rating} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div> */}
{/* 
                <button type="button" className="mt-4 text-teal-600 font-medium hover:text-teal-700">
                  Load More Reviews...
                </button> */}
              </div>

              {/* Terms and Conditions */}
              <div className="mt-10 pb-8">
                <details className="border border-gray-200 rounded-lg overflow-hidden">
                  <summary className="p-4 bg-gray-50 cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                    <span>Terms and conditions</span>
                    <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600 text-sm">Applicable terms and conditions apply. For more details, please contact our support team.</p>
                  </div>
                </details>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
              <div className="lg:pl-8">
                <h1 className="text-3xl font-bold text-gray-900">Lenskart at Home</h1>
                <h2 className="text-xl text-gray-600 mt-1">Eye Test & Frame Trial Service</h2>

                {/* Rating */}
                {/* <div className="flex items-center gap-1 mt-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} filled={i < 4} />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">4.9</span>
                  <span className="text-gray-500">(17k)</span>
                </div> */}

                {/* Eye Test Eligibility */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Eye test eligibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/HTO/HTOAppointmentConfirmed.svg" alt="check" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">A well-lit room with 10 ft space is required</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/HTO/HTOAppointmentConfirmed.svg" alt="check" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">Required age for eye test is 14 - 75 years</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/DesignStudioIcons/RedCross.svg" alt="cross" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">Not for Diabetics or those with High BP (Clinical eye test is required)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6" />

                {/* What to Expect */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What to expect?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/HTO/EyeWithTorch.svg" alt="icon" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">12 Step Eye Checkup by certified professionals</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/HTO/EyeWithBoxes.svg" alt="icon" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">Latest Eye Test Equipments</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <img src="https://static.lenskart.com/media/desktop/img/HTO/Glasses.svg" alt="icon" className="w-5 h-5 mt-1" />
                      <p className="text-gray-700">Try 150+ frames at home</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6" />

                {/* Price */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">Lenskart at Home</h2>
                  {/* <div className="flex items-center gap-3 mt-2">
                    <span className="text-xl text-gray-400 line-through">₹120</span>
                    <span className="text-2xl font-bold text-gray-900">₹99</span>
                  </div> */}
                </div>

                {/* Book CTA Button */}
                <button
                  type="button"
                  onClick={handleBookAppointment}
                  className="w-full mt-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
                >
                  BOOK APPOINTMENT
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

HomeTryOnPage.displayName = "HomeTryOnPage";