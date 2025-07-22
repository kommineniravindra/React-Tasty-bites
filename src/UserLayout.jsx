// UserLayout.jsx
import React from 'react';
import Navbar from './Navbar';

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>{children}</div>
    </>
  );
}

export default UserLayout;
