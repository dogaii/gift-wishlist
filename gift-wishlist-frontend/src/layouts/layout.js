// src/layouts/Layouts.js
import React from 'react';

/** 
 * AuthLayout: For login/register pages
 *   - No white background container, so your background image shows through.
 */
export function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: '80vh' }}>
      {children}
    </div>
  );
}

/**
 * MainLayout: For dashboard, wishlist pages, etc.
 *   - Uses the .main-content styles to provide a white card-like background.
 */
export function MainLayout({ children }) {
  return <div className="main-content">{children}</div>;
}
