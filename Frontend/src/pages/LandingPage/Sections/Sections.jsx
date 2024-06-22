import React from "react";
import Individual from "./components/Individual";
import Footer from "./components/Footer";
import About from "./components/About";
import Services from "./components/Services";
import Provider from "./components/Provider";

const Sections = () => {
  return (
    <div className="m-0">
      <Individual />
      <Provider />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Sections;
