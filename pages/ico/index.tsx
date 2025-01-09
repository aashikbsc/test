import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import Hero from "components/ico/Hero";
import LaunchPad from "components/ico/LaunchPad";
import LaunchTop from "components/ico/LaunchTop";
import SellingSection from "components/ico/SellingSection";
import {
  PHASE_SORT_BY_FEATURED,
  PHASE_SORT_BY_FUTURE,
  PHASE_SORT_BY_RECENT,
} from "helpers/core-constants";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { customPage, landingPage } from "service/landing-page";
import {
  getLaunchpadLandingPageAction,
  getLaunchpadListAction,
} from "state/actions/launchpad";

const Index = () => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(true);
  const [launchpadLandingPage, setLaunchpadLandingPage]: any = useState([]);
  const [launchpadFeatureItem, setLaunchpadFeatureItem]: any = useState([]);
  const [launchpadUpcomingItem, setLaunchpadUpcomingItem]: any = useState([]);
  const [launchpadRecentItem, setLaunchpadRecentItem]: any = useState([]);
  useEffect(() => {
    getLaunchpadListAction(
      setLaunchpadRecentItem,
      setLaunchpadFeatureItem,
      setLaunchpadUpcomingItem,
      setLoading
    );
    getLaunchpadLandingPageAction(setLaunchpadLandingPage);
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      {loading ? (
        <SectionLoading />
      ) : (
        <div className="launchPad">
          <LaunchTop data={launchpadLandingPage?.data} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="launch-body container-4xl mt-5">
            <Hero data={launchpadLandingPage?.data} />
            <PlaceTopLeft />
            <PlaceBottomRight />
            {launchpadFeatureItem.length > 0 && (
              <>
                <h2 className="">{t("Featured Item")}</h2>
                <Slider {...settings}>
                  {launchpadFeatureItem.map((item: any, index: number) => (
                    <div className="p-3" key={index}>
                      <LaunchPad
                        viewMore={false}
                        data={item}
                        core={PHASE_SORT_BY_FEATURED}
                      />
                    </div>
                  ))}
                </Slider>
              </>
            )}
            {launchpadRecentItem?.length > 0 && (
              <>
                <div
                  id="carouselExampleControls"
                  className="carousel slide "
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    <h2 className="mb-2">{t("Ongoing Item")}</h2>
                    {launchpadRecentItem.map((item: any, index: number) => (
                      <div
                        className={`${
                          index == 0 && "active"
                        } carousel-item px-4`}
                        key={index}
                      >
                        <LaunchPad
                          key={index}
                          viewMore={
                            launchpadRecentItem?.length == index + 1
                              ? true
                              : false
                          }
                          data={item}
                          core={PHASE_SORT_BY_RECENT}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {launchpadRecentItem?.length > 0 && (
                  <div className="viewMoreLink">
                    <Link
                      href={"/ico/view-all/lists?type=" + PHASE_SORT_BY_RECENT}
                    >
                      <a>{t(`View more`)}</a>
                    </Link>
                  </div>
                )}
              </>
            )}
            {launchpadUpcomingItem.length > 0 && (
              <>
                <div
                  id="carouselExampleControls"
                  className="carousel slide "
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    <h2 className="mb-2">{t("Upcoming Item")}</h2>
                    {launchpadUpcomingItem.map((item: any, index: number) => (
                      <div
                        className={`${
                          index == 0 && "active"
                        } carousel-item px-4`}
                        key={index}
                      >
                        <LaunchPad
                          key={index}
                          viewMore={
                            launchpadUpcomingItem?.length == index + 1
                              ? true
                              : false
                          }
                          data={item}
                          core={PHASE_SORT_BY_FUTURE}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {launchpadUpcomingItem?.length > 0 && (
                  <div className="viewMoreLink">
                    <Link
                      href={"/ico/view-all/lists?type=" + PHASE_SORT_BY_FUTURE}
                    >
                      <a>{t(`View more`)}</a>
                    </Link>
                  </div>
                )}
              </>
            )}

            <SellingSection data={launchpadLandingPage?.data} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data } = await landingPage(ctx.locale);
  const cookies = parseCookies(ctx);
  return {
    props: {
      landing: data,
      bannerListdata: data.banner_list,
      announcementListdata: data.announcement_list,
      socialData: data.media_list,
      featureListdata: data.feature_list,
      asset_coin_pairs: data.asset_coin_pairs,
      hourly_coin_pairs: data.hourly_coin_pairs,
      latest_coin_pairs: data.latest_coin_pairs,
      loggedin: cookies.token ? true : false,
      landing_banner_image: data?.landing_banner_image
        ? data?.landing_banner_image
        : null,
    },
  };
};
export default Index;
