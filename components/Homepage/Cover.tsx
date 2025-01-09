import { motion, useAnimation } from "framer-motion";
import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PlaceBottomRight from "components/gradient/placeBottomRight";

const Cover = ({ landing, loggedin, landing_banner_image }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const textControls = useAnimation();
  const imageControls = useAnimation();

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: any) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
        delay: index * 0.5,
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  useEffect(() => {
    // Trigger text animation with a delay
    textControls.start("visible");

    // Trigger image animation after a longer delay
    setTimeout(() => {
      imageControls.start("visible");
    }, 1500);
  }, [textControls, imageControls]);

  return (
    <div>
      {parseInt(landing?.landing_first_section_status) === 1 && (
        <section className="hero-banner-area">
          <div className={"placeTopLeft"}>
            <img
              src="https://assets-global.website-files.com/60c8db180183804ef2b45120/60cb6b0ac3e71fa837cb2929_hero-glow.svg"
              alt="Hero Banner"
            />
          </div>
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="row">
              <div className="col-md-6 conver-col1">
                <motion.h1
                  className="banner-title"
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate={textControls}
                >
                  {landing?.landing_title ||
                    t("Buy & Sell Instantly And Hold Cryptocurrency")}
                </motion.h1>
                <motion.p
                  className="banner-content"
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate={textControls}
                >
                  {landing?.landing_description ||
                    t(
                      "Tradexpro exchange is such a marketplace where people can trade directly with each other"
                    )}
                </motion.p>
                {!loggedin && (
                  <motion.a
                    href={
                      router.locale !== "en"
                        ? `/${router.locale}/signup`
                        : "/signup"
                    }
                    className="glass-button mt-4"
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    animate={textControls}
                  >
                    {t("Register Now")}
                  </motion.a>
                )}
              </div>
              <div className="col-md-6 hero-banner-img">
                <img
                  src={
                    landing_banner_image ||
                    "/undraw_crypto_flowers_re_dyqo.svg"
                  }
                  height={440}
                  alt="banner"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cover;
