import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container w-2/3 mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          GameStars
        </Link>
        <nav>
          <Link href="/tournaments" className="ml-4 text-lg text-green-400 hover:text-white">
            Tournaments
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
