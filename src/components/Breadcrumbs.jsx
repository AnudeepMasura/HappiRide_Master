import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Capitalize word function
  const formatName = (string) => {
    return string
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium py-1.5 mb-4">
      <Link
        to="/"
        className="flex items-center hover:text-olive-600 transition-colors"
      >
        <Home size={14} className="mr-1" />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={12} className="text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">{formatName(name)}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-olive-600 transition-colors"
              >
                {formatName(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
