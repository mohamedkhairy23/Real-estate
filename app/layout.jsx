import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";
import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";

export const metadata = {
  title: "PropertyPulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

const MainLayout = ({ children }) => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <Navbar />
            <div>{children}</div>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default MainLayout;
