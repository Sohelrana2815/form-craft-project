const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center xl:h-[800px] h-[600px] font-semibold text-center">
      <h1 className="xl:text-6xl">403 No access!</h1>
      <p className="xl:text-2xl text-gray-700">
        To access this page, you need admin privileges.
      </p>
    </div>
  );
};

export default Unauthorized;
