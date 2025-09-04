"use client";

import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Props for the CsrfToken component.
 */
export interface CsrfTokenProps {
  /** The initial CSRF token value, typically obtained server-side. */
  initialToken: string | undefined;
}

/**
 * CsrfToken component that renders a hidden input field containing the CSRF token.
 * Updates the token dynamically on the client side if needed.
 */
export default function CsrfToken({ initialToken }: CsrfTokenProps) {
  const [token, setToken] = useState(initialToken ?? "");

  useEffect(() => {
    getCsrfToken().then((newToken) => {
      if (newToken) {
        setToken(newToken);
      }
    });
  }, []);

  return <input type="hidden" name="csrfToken" value={token} />;
}
