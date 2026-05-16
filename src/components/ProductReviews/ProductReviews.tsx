import { memo, useMemo, useCallback, useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful: number;
}

const DUMMY_REVIEWS: Review[] = [
  { id: "r1", author: "Rahul S.", rating: 5, title: "Excellent quality!", body: "The frame is very lightweight and comfortable. Highly recommend for daily use.", date: "2 weeks ago", helpful: 24 },
  { id: "r2", author: "Priya M.", rating: 4, title: "Good value for money", body: "Nice product at this price point. The build quality is decent.", date: "1 month ago", helpful: 18 },
  { id: "r3", author: "Amit K.", rating: 5, title: "Love the design", body: "Bought these for my wife and she absolutely loves them. Great style!", date: "3 weeks ago", helpful: 12 },
  { id: "r4", author: "Neha G.", rating: 4, title: "Stylish frames", body: "Look exactly like the picture. Fast delivery too.", date: "1 month ago", helpful: 9 },
];

const DISTRIBUTION = { 5: 65, 4: 20, 3: 8, 2: 4, 1: 3 };
const AVERAGE = 4.5;
const TOTAL = 120;

export const ProductReviews = memo(function ProductReviews(): JSX.Element {
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(DUMMY_REVIEWS.map((r) => [r.id, r.helpful]))
  );

  const handleHelpful = useCallback((id: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }, []);

  const stars = useCallback((n: number) => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= n ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return arr;
  }, []);

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Customer Reviews</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl font-bold text-gray-900">{AVERAGE}</span>
          <div>
            <div className="flex gap-0.5">{stars(Math.round(AVERAGE))}</div>
            <p className="text-sm text-gray-500 mt-0.5">{TOTAL} Reviews</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const pct = DISTRIBUTION[star];
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-600">{star}</span>
                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500 text-xs">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        {DUMMY_REVIEWS.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{review.author}</p>
                <div className="flex gap-0.5">{stars(review.rating)}</div>
              </div>
              <span className="ml-auto text-xs text-gray-400">{review.date}</span>
            </div>
            <p className="font-medium text-gray-800 text-sm mt-2">{review.title}</p>
            <p className="text-gray-600 text-sm mt-1">{review.body}</p>
            <button
              onClick={() => handleHelpful(review.id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Helpful ({helpfulCounts[review.id]})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});

ProductReviews.displayName = "ProductReviews";
