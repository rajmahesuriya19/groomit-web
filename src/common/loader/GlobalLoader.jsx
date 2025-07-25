import { useLoader } from "@/contexts/loaderContext/LoaderContext";


const GlobalLoader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 z-[9999] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF314A] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
