const NavigationBtn = () => {
  return (
    <>
      <button
        id="mobileMenuToggle"
        className="sm:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none relative z-[999]"
      >
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 mb-0 bg-gray-800"></span>
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
        <span className="origin-center transition-transform duration-300 ease-in-out h-[1px] w-6 bg-gray-800"></span>
      </button>
    </>
  );
};

export default NavigationBtn;
