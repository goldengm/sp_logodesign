const Banner = (props: { title: string; description: string }) => {
  const { title, description } = props;

  return (
    <div className="flex w-full h-[150px] flex-col bg-blue-700 rounded-md bg-cover mt-2 px-[10px] py-[10px] md:px-[24px] md:py-[26px]">
      <div className="w-full">
        <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
          {title}
        </h4>
        <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
          {description}
        </p>

        {/* <div className="mt-[36px] flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
          <button className="text-black linear rounded-md bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 active:!bg-white/70">
            Discover now
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Banner;
