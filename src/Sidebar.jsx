// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   Home,
//   PlusCircle,
//   Eye,
//   LogOut
// } from 'lucide-react'; // You can install with: npm install lucide-react
// import './Sidebar.css';

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
//       <div className="sidebar-header">
//         <h2 className="brand">{!collapsed && 'FoodDesk Admin'}</h2>
//         <button className="toggle-button" onClick={toggleSidebar}>
//           ☰
//         </button>
//       </div>
//       <ul className="sidebar-menu">
//         <li>
//           <NavLink to="/admin/dashboard" className="nav-link">
//             <Home className="icon" />
//             {!collapsed && <span>Dashboard</span>}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/admin/add-product" className="nav-link">
//             <PlusCircle className="icon" />
//             {!collapsed && <span>Add Product</span>}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/admin/view-products" className="nav-link">
//             <Eye className="icon" />
//             {!collapsed && <span>View Products</span>}
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/logout" className="nav-link">
//             <LogOut className="icon" />
//             {!collapsed && <span>Logout</span>}
//           </NavLink>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
