import React from "react";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import Sections from "./Sections/Sections";
import BgVideo from "../../assets/video/bg-1.mkv";
import BgImage from "../../assets/img/picture2.jpg";

const LandingPage = () => {
  return (
    <div className="bg-[rgba(0,0,0,0.1)] w-[100vw] h-[100vh] overflow-y-scroll overflow-x-hidden">
      {/* <video
        className="absolute w-full h-full xxs:scale-75 z-[-1] object-cover"
        autoPlay
        muted
        src={BgVideo}
        preload="auto"
        poster={BgImage}
        playsInline
      ></video> */}
      <video
        className="fixed w-full h-full object-cover z-[-1] md:inline-block xxs:hidden"
        autoPlay
        muted
        playsInline
        poster={BgImage}
      >
        <source src={BgVideo} type="video/mp4" />
      </video>      
      <Navbar />
      <Hero />
      <Sections />
      {/* <div className={`${styles.flexStart}`}>
        <Hero />
      </div> */}

      {/* <div className={`bg-primary-500 ${styles.paddingX} ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Stats /> <Business /> <Billing /> <CardDeal /> <Testimonials />{" "}
              <Clients /> <CTA /> <Footer />
            </div>
          </div> */}
    </div>
  );
};

export default LandingPage;
