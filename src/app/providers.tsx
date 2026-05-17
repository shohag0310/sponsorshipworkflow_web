import type { ReactNode } from "react";
import { AuthProvider } from "../auth/AuthContext";
import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}