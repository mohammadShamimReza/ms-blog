import { ThemeProvider, useTheme } from "next-themes";
import { ReactElement } from "react";

import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";

function Layout({ children }: { children: ReactElement }) {
  const { theme } = useTheme();
  console.log(theme);

  return (
    <ThemeProvider attribute="class">
      <div className="">
        <NavBar />
        <div className="min-h-screen flex justify-center m-4">
          <div className="w-full max-w-5xl p-4 border border-b-0 border-t-0  border-r-gray-200 border-l-gray-200 dark:border-l-gray-600 dark:border-r-gray-600 ">
            {children}
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
