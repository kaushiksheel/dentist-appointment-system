import { Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import Fallback from "./Fallback";

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<Fallback />}>{children}</Suspense>
  </ErrorBoundary>
);

export default LazyWrapper;
