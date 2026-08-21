import { Component, type ReactNode } from "react";

interface ReviewErrorBoundaryProps {
  children: ReactNode;
}

interface ReviewErrorBoundaryState {
  hasError: boolean;
}

export class ReviewErrorBoundary extends Component<
  ReviewErrorBoundaryProps,
  ReviewErrorBoundaryState
> {
  state: ReviewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ReviewErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Review section error:", error);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-red-700 mb-1">
            Something went wrong displaying reviews
          </p>
          <p className="text-xs text-gray-500 mb-4">
            The rest of this page is unaffected.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
