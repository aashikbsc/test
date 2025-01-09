import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const LaunchTop = ({ data }: any) => {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${data?.launchpad_cover_image})`,
        }}
        className="section-top-wrap py-5 mb-25 background-image-class"
      >
        <div className="container-4xl">
          <div className="overview-area">
            <div className="overview-left ">
              <h1 className="big-top-title text-white">
                {data?.launchpad_first_title
                  ? data?.launchpad_first_title
                  : t("Tradexpro Token Launch Platform")}
              </h1>
              <h4 className="blance-title text-white">
                {data?.launchpad_first_description
                  ? data?.launchpad_first_description
                  : t("Buy Or Earn New Tokens Directly On Tradexpro.")}
              </h4>
            </div>
          </div>

          {isLoggedIn && (
            <Link href="/ico/applied-launchpad">
              <button className="transparent_btn mt-5">
                {t("Launchpad dashboard")}
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="container-4xl">
        <div className="row my-5 ">
          <div className="col-6 col-lg-3">
            <div className="boxShadow text-center py-5 px-4 shadow-sm">
              <div className="d-flex justify-content-center">
                <span className="card-top-icon mb-3">
                  <i className="fa fa-ticket" aria-hidden="true"></i>
                </span>
              </div>
              <h2>
                {parseFloat(
                  data?.current_funds_locked ? data?.current_funds_locked : 0
                )}
              </h2>
              <h4 className="mt-2 font_size">{t("Total Supplied Token")}</h4>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="boxShadow text-center py-5 px-4 shadow-sm">
              <div className="d-flex justify-content-center">
                <span className="card-top-icon mb-3">
                  <i className="fa fa-ticket" aria-hidden="true"></i>
                </span>
              </div>
              <h2>
                {parseFloat(
                  data?.total_funds_raised ? data?.total_funds_raised : 0
                )}
              </h2>
              <h4 className="mt-2 font_size">{t("Total Sold Raised")}</h4>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="boxShadow text-center py-5 px-4 shadow-sm">
              <div className="d-flex justify-content-center">
                <span className="card-top-icon mb-3">
                  <i className="fa fa-ticket" aria-hidden="true"></i>
                </span>
              </div>
              <h2>
                {parseInt(
                  data?.project_launchpad ? data?.project_launchpad : 0
                )}
              </h2>
              <h4 className="mt-2 font_size">{t("Projects Launched")}</h4>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="boxShadow text-center py-5 px-4 shadow-sm">
              <div className="d-flex justify-content-center">
                <span className="card-top-icon mb-3">
                  <i className="fa fa-ticket" aria-hidden="true"></i>
                </span>
              </div>
              <h2>
                {parseInt(
                  data?.all_time_unique_participants
                    ? data?.all_time_unique_participants
                    : 0
                )}
              </h2>
              <h4 className="mt-2 font_size"> {t("Total Participants")}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchTop;
