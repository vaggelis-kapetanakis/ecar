

const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph:
    "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",

  classicTransition: "transition duration-300 ease-in-out",

  respFontTiny:
    "xl:text-[0.8rem] lg:text-[0.8rem] md:text-[0.8rem] sm:text-[0.8rem] ss:text-[0.8rem] xs:text-[0.7rem] xxs:text-[0.6rem]",
  respFontExtraSmaller:
    "xl:text-[0.9rem] lg:text-[0.9rem] md:text-[0.9rem] sm:text-[0.9rem] ss:text-[0.9rem] xs:text-[0.9rem] xxs:text-[0.8rem]",
  respFontExtraSmall:
    "xl:text-[1rem] lg:text-[1rem] md:text-[1rem] sm:text-[1rem] ss:text-[1rem] xs:text-[1rem] xxs:text-[0.9rem]",
  respFontSmaller:
    "xl:text-[1.1rem] lg:text-[1.1rem] md:text-[1.1rem] sm:text-[1.1rem] ss:text-[1.1rem] xs:text-[1.2rem] xxs:text-[1rem]",
  respFontSmall:
    "xl:text-[1.3rem] lg:text-[1.3rem] md:text-[1.3rem] sm:text-[1.3rem] ss:text-[1.3rem] xs:text-[1.3rem] xxs:text-[1.2rem]",
  respFontNormal:
    "xl:text-[1.4rem] lg:text-[1.4rem] md:text-[1.4rem] sm:text-[1.4rem] ss:text-[1.4rem] xs:text-[1.4rem] xxs:text-[1.3rem]",
  respFontLarge:
    "xl:text-[1.6rem] lg:text-[1.6rem] md:text-[1.6rem] sm:text-[1.6rem] ss:text-[1.6rem] xs:text-[1.6rem] xxs:text-[1.4rem]",
  respFontLarger:
    "xl:text-[1.8rem] lg:text-[1.8rem] md:text-[1.8rem] sm:text-[1.8rem] ss:text-[1.8rem] xs:text-[1.8rem] xxs:text-[1.6rem]",
  respFontExtraLarge:
    "xl:text-[2rem] lg:text-[2rem] md:text-[2rem] sm:text-[2rem] ss:text-[2rem] xs:text-[2rem] xxs:text-[1.8rem]",
  respFontExtraLarger:
    "xl:text-[2.2rem] lg:text-[2.2rem] md:text-[2.2rem] sm:text-[2.2rem] ss:text-[2.2rem] xs:text-[2.2rem] xxs:text-[2rem]",
  respFontSidebar:
    "xl:text-[2.3rem] lg:text-[2.3rem] md:text-[2.3rem] sm:text-[2.3rem] ss:text-[2.3rem] xs:text-[2.2rem] xxs:text-[2rem]",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;
