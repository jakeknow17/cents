import { NavLink } from "react-router";
import { useRef } from "react";

function NavBar() {
  const drawerRef = useRef<HTMLInputElement>(null);
  
  const navItems = [
    { id: 0, name: "Dashboard", path: "/" },
    { id: 1, name: "Transactions", path: "transactions" },
  ];

  return (
    <div className="drawer">
             <input ref={drawerRef} id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav>
          <div className="navbar bg-base-100 shadow-sm">
            {/* Left menu button */}
            <div className="navbar-start lg:hidden">
              <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
            </div>

            {/* Left elements - links */}
            <div className="navbar-start hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                {navItems.map((item) => {
                  return (
                    <li key={item.id}>
                      <NavLink className="text-lg" to={item.path} end>
                        {item.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Center elements */}
            <div className="navbar-center">
              <div className="font-bold text-4xl">Cents</div>
            </div>

            {/* Right elements */}
            <div className="navbar-end"></div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div className="drawer-side">
        <label
          htmlFor="nav-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="mb-4 text-2xl font-bold text-center py-4">Cents</div>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                     {navItems.map((item) => {
             return (
               <li key={item.id}>
                 <NavLink 
                   className="text-lg py-3" 
                   to={item.path} 
                   end
                   onClick={() => {
                     if (drawerRef.current) {
                       drawerRef.current.checked = false;
                     }
                   }}
                 >
                   {item.name}
                 </NavLink>
               </li>
             );
           })}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
