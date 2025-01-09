import useTranslation from "next-translate/useTranslation";
import { FaApple, FaGoogle, FaWindows, FaLinux, FaMap } from "react-icons/fa";

import React from "react";
import BlockComponent from "components/Animation/block-component";
import PlaceBottomRight from "components/gradient/placeBottomRight";

const DistributionSection = ({ landing }: any) => {
  const { t } = useTranslation("common");

  return (
    <div>
      {parseInt(landing?.landing_fourth_section_status) === 1 &&
        parseInt(landing?.download_link_display_type) === 1 && (
          <section className="trade-anywhere-area sectiob-bg bg-transparent">
            <div className="placeTopLeft">
              <img
                src="https://assets-global.website-files.com/60c8db180183804ef2b45120/60cb6b0ac3e71fa837cb2929_hero-glow.svg"
                alt="Hero Banner"
              />
            </div>
            <PlaceBottomRight />
            <div className="container-4xl trade-anywhere-container rounded-27">
              <div className="section-title">
                <h2 className="title">{landing?.trade_anywhere_title}</h2>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="trade-anywhere-left text-center">
                    <img
                      className="trend-image"
                      src={landing?.trade_anywhere_left_img}
                      alt="trade-imge"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="trade-anywhere-right">
                    <div className="avable-items">
                      <ul className="item-lsit row">
                        {landing?.apple_store_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.apple_store_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaApple
                                    size={22}
                                    color="var(--font-color)"
                                  />
                                }
                              />
                            </a>
                          </li>
                        )}

                        {landing?.google_store_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.google_store_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaGoogle
                                    size={22}
                                    color="var(--font-color)"
                                  />
                                }
                              />
                            </a>
                          </li>
                        )}

                        {landing?.macos_store_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.macos_store_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaApple
                                    size={22}
                                    color="var(--font-color)"
                                  />
                                }
                              />
                            </a>
                          </li>
                        )}

                        {landing?.windows_store_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.windows_store_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaWindows
                                    size={22}
                                    color="var(--font-color)"
                                  />
                                }
                              />
                            </a>
                          </li>
                        )}

                        {landing?.linux_store_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.linux_store_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaLinux
                                    size={22}
                                    color="var(--font-color)"
                                  />
                                }
                              />
                            </a>
                          </li>
                        )}

                        {landing?.api_link && (
                          <li className="single-item col-6 col-sm-4">
                            <a
                              href={landing?.api_link ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BlockComponent
                                gradientClass="gradient-full"
                                icon={
                                  <FaMap size={22} color="var(--font-color)" />
                                }
                              />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </div>
  );
};

export default DistributionSection;
