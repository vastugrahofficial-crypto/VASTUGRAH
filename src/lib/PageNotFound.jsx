import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-display text-primary mb-4">404</p>
      <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">The cosmic page you seek does not exist in this realm.</p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}