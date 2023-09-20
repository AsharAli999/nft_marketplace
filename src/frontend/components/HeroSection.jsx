import React from "react";

//INTERNAL IMPORT
import Style from "./HeroSection.module.css";
// import Button from "../Button/Button";

const HeroSection = () => {
  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h2 className="text-white text-left text-5xl mt-4">Discover, collect, and sell NFTs </h2>
          <p className="text-white text-left mt-8">
            Discover the most outstanding NTFs in all topics of life. Creative
            your NTFs and sell them.
          </p>
        </div>
        <div className={Style.heroSection_box_right}>
          <img src="https://www.ie.edu/insights/wp-content/uploads/2022/01/San-Jose-Feature.jpg" alt="Hero section" width={600} height={600} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
