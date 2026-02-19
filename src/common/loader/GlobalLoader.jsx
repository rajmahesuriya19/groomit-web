import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import Lottie from "lottie-react";
import walkingDog from "@/assets/Loader/walkingDog.json";
import { useEffect, useState } from "react";

const GlobalLoader = () => {
  const { loading } = useLoader();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center
      bg-white/80
      transition-opacity duration-300
      ${loading ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`flex flex-col items-center px-10 py-8
        transition-all duration-300
        ${loading ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Lottie */}
        <div className="w-40 md:w-52">
          <Lottie animationData={walkingDog} loop />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
