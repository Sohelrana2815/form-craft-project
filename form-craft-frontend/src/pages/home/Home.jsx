import CreateTemBtn from "./createTemBtn/CreateTemBtn";
import GalleryTemplate from "./gallery/GalleryTemplate";

const Home = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto mt-20 space-y-10 p-3">
        <CreateTemBtn />
        <GalleryTemplate />
      </div>
    </>
  );
};

export default Home;
