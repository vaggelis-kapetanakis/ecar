import React from "react";

const Sidebar = React.lazy(() =>
  import("../../pages/Dashboard/Sidebar/Sidebar")
);
const SidebarResp = React.lazy(() =>
  import("../../pages/Dashboard/Sidebar/SidebarResp")
);

const Layout = ({ children }) => {
  return (
    <div
      className="w-screen h-screen
     p-0 m-0 flex flex-shrink-0 antialiased 
     overflow-hidden flex-row gap-5"
    >
      <div className="sm:flex xxs:hidden">
        <Sidebar />
      </div>
      <div className="sm:hidden xxs:flex">
        <SidebarResp />
      </div>
      <main className="w-full h-full md:pr-12 xxs:pr-4 xl:ml-56 md:ml-32 sm:ml-24 xxs:ml-0 overflow-scroll">
        {children}
      </main>
    </div>
  );
};

export default Layout;
