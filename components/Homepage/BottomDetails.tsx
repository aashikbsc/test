import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const BottomDetails = ({ landing }: any) => {
  const { t } = useTranslation("common");
  return (
    <div>
      {" "}
      {parseInt(landing?.landing_fifth_section_status) === 1 && (
        <section className="trade-anywhere-area bg-transparent">
          <div className="placeTopLeft">
            <img
              src="https://assets-global.website-files.com/60c8db180183804ef2b45120/60cb6b0ac3e71fa837cb2929_hero-glow.svg"
              alt="Hero Banner"
            />
          </div>
          <div className="container-4xl trade-anywhere-container rounded-27">
            <div className="section-title">
              <h2 className="title"> {landing?.secure_trade_title} </h2>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="trade-anywhere-left">
                  <img
                    className="trend-image"
                    src={landing?.secure_trade_left_img}
                    alt="trade-imge"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="trade-anywhere-right">
                  <h2 className="subtitle"> {landing?.customization_title} </h2>
                  <p>{landing?.customization_details}</p>
                  <a
                    href={`${landing?.know_more_link || "/"}`}
                    className="glass-button"
                  >
                    {t(landing?.know_more_button_title || "Know More")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BottomDetails;
