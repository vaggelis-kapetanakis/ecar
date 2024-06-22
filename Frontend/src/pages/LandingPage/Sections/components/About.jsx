import React from "react";
import Fade from "react-reveal/Fade";
import Collapsible from "react-collapsible";
import styles from "../../../../style";

const About = () => {
  return (
    <div className="w-screen md:h-screen xxs:h-[20%] flex gap-5 bg-black
     items-center justify-center" id="about">
      <div className="w-full h-full md:px-56 md:mb-0 xxs:mb-20 xxs:px-5 gap-20 flex md:flex-row xxs:flex-col items-center justify-between">
        <Fade bottom>
          <div className="w-[75%] md:pr-20 xxs:pr-0">
            <h1 className={`${styles.respFontExtraLarge} font-bold mb-3 text-gradient`}>
              About this Project.
            </h1>
            <p className={`${styles.respFontSmall} text-white`}>
              This project was made by{" "}
              <span className={`${styles.respFontSmall} text-primary-500 font-semibold`}>
                Vaggelis Kapetanakis (link to port here)
              </span>
              . Its frontend was made using React and its backend using Node Js
              , MongoDB and Express.
            </p>
          </div>
          <Collapsible trigger="Analytical Approach">
            <p className={`${styles.respFontSmaller} antialiased font-light`}>
              This project is an updated version from an older one that was
              issued from my university - the National Technical University of
              Athens - from a class surrounding software engineering. Basically
              this is my third project concerning the MERN Stack.
            </p>
            <br />
            <>
              Some Noticeable assets about this website:
              <ul className="about-ul">
                <li className={`${styles.respFontSmaller} ml-5 mt-3`}>
                  All data except user's are real-world data.
                </li>
                <li className={`${styles.respFontSmaller} ml-5`}>
                  If you login as an owner and allow this website to use your
                  location you will be able to see on your dashboard all of the
                  available charging stations within 15km radius from you (if
                  your distance from them was a straight line). This feature was
                  possible thanks to mapbox.
                </li>
                <li className={`${styles.respFontSmaller} ml-5`}>
                  Following the previous point, if you click on a station you
                  will get some specific data but you will also get the
                  distance, the duration as well as directions to get to the
                  station. Your location is not updated as you move (keep in
                  mind that this whole project was made by one person 😊)
                </li>
                <li className={`${styles.respFontSmaller} ml-5`}>
                  If you login as a provider and navigate to the "Manage
                  Stations" tab you will meet a map with all of "your" charging
                  stations and by clicking them you will get the corresponding
                  data.
                </li>
                <li className={`${styles.respFontSmaller} ml-5`}>
                  The video playing at the start at the hero section was made by
                  me using a 3D model at blender. Even though it is free to use
                  it's an incredible model with a lot of detail made by
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://sketchfab.com/3d-models/tesla-roadster-2020-1fbf29e297bd4a17ac39a00a378441d8"
                  >
                    metarex.4d
                  </a>{" "}
                </li>
                <li className={`${styles.respFontSmaller} ml-5`}>
                  The 3D animations and interactions at the landing page were
                  made using spline.
                </li>
              </ul>
            </>
          </Collapsible>
        </Fade>
      </div>
    </div>
  )
}

export default About