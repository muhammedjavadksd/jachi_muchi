import { memo, useMemo, useState, useCallback } from "react";



/** 3D Model interface */
interface Model3D {
  id: string;
  image: string;
  name: string;
  createdAt: string;
}

/** Sample 3D models data */
const SAMPLE_MODELS: Model3D[] = [
  { id: "1", image: "/category/image.png", name: "Front View", createdAt: "14 Feb 2026" },
  { id: "2", image: "/category/image.png", name: "Side View Left", createdAt: "14 Feb 2026" },
  { id: "3", image: "/category/image.png", name: "Side View Right", createdAt: "14 Feb 2026" },
  { id: "4", image: "/category/image.png", name: "Model 4", createdAt: "10 Feb 2026" },
  { id: "5", image: "/category/image.png", name: "Model 5", createdAt: "08 Feb 2026" },
  { id: "6", image: "/category/image.png", name: "Model 6", createdAt: "05 Feb 2026" },
];

export const My3DModelPage = memo(function My3DModelPage(): JSX.Element {
  const [models, setModels] = useState<Model3D[]>(SAMPLE_MODELS);

  const handleDeleteModel = useCallback((modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
  }, []);

  // Sidebar now rendered by <AccountSidebar />

  // Model Cards
  const modelCards = useMemo(() => (
    models.map((model) => (
      <div 
        key={model.id} 
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
      >
        <div className="relative h-44 bg-gray-100">
          <img 
            src={model.image} 
            alt={model.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-xl">
            3D
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">Created: {model.createdAt}</p>
          <p className="font-medium text-gray-900 mb-4">{model.name}</p>

          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Try On
            </button>

            <button
              onClick={() => handleDeleteModel(model.id)}
              className="py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 transition-colors"
              aria-label="Delete model"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ))
  ), [models, handleDeleteModel]);

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My 3D Models</h1>
        <p className="text-gray-500 mt-1">Manage your face scans for virtual try-on</p>
      </div>

      {/* Create New Button */}
      <button className="w-full md:w-auto mb-6 px-6 py-3.5 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Create New 3D Model
      </button>

      {/* How it works Info */}
      <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              Your 3D face model helps you virtually try on glasses from any device. 
              Simply scan your face using your device camera, and we'll create a realistic 3D model 
              that you can use to see how different frames look on you.
            </p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {models.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {modelCards}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No 3D Models Yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Create your first 3D face model to try on glasses virtually before you buy.
          </p>
          <button className="px-8 py-3.5 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First 3D Model
          </button>
        </div>
      )}
    </>
  );
});

My3DModelPage.displayName = "My3DModelPage";