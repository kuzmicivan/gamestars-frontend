import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container w-2/3 mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          GameStars
        </Link>
      </div>
    </header>
  );
};

export default Header;
