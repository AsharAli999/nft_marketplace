import React from "react";

//INTERNAL IMPORT
import Style from "./HeroSection.module.css";
// import Button from "../Button/Button";

const HeroSection = () => {
  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h1 className="text-white">Discover, collect, and sell NFTs </h1>
          <p className="text-white">
            Discover the most outstanding NTFs in all topics of life. Creative
            your NTFs and sell them
          </p>
          {/* <Button btnName="Start your search" handleClick={() => { }} /> */}
        </div>
        <div className={Style.heroSection_box_right}>
          <img src="https://www.ie.edu/insights/wp-content/uploads/2022/01/San-Jose-Feature.jpg" alt="Hero section" width={600} height={600} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
