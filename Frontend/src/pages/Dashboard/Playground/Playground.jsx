import React from "react";
import styles from "../../../style";
import Layout from "../../../UIElements/Layout/Layout";
import Sidebar from "../Sidebar/Sidebar";

const Playground = () => {
  return (
    <Layout>
      <dib className="w-full h-full rounded-xl bg-dark1">
        <h1 className={`${styles.respFontExtraLarger} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontExtraLarge} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontLarger} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontLarge} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontNormal} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontSmall} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontSmaller} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontExtraSmall} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontExtraSmaller} text-white`}>
          This is some text
        </h1>
        <h1 className={`${styles.respFontTiny} text-white`}>
          This is some text
        </h1>
      </dib>
    </Layout>
  );
};

export default Playground;
