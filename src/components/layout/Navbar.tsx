import React from 'react';

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'Familiar' }) => {
  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        {/* Placeholder for future nav items */}
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;