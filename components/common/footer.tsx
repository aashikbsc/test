import { CUSTOM_PAGE_LINK_PAGE } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const socialDefaltData = [
  {
    id: 7,
    media_title: "instagram",
    media_link: "https://www.instagram.com/",
    media_icon: "/instagram_1.svg",
    status: 1,
    created_at: "2023-05-29T07:00:22.000000Z",
    updated_at: "2023-06-02T11:47:27.000000Z",
  },
  {
    id: 6,
    media_title: "Printerest",
    media_link: "https://www.pinterest.com/",
    media_icon: "/social_1.svg",
    status: 1,
    created_at: "2023-05-29T06:57:13.000000Z",
    updated_at: "2023-06-02T11:46:53.000000Z",
  },
  {
    id: 5,
    media_title: "Discord",
    media_link: "https://discord.com/",
    media_icon: "/discord_1.svg",
    status: 1,
    created_at: "2023-05-29T06:51:16.000000Z",
    updated_at: "2023-06-02T11:48:17.000000Z",
  },
  {
    id: 4,
    media_title: "Linkedin",
    media_link: "https://www.linkedin.com/",
    media_icon: "/linkedin_123.svg",
    status: 1,
    created_at: "2022-07-23T10:16:17.000000Z",
    updated_at: "2023-06-02T11:52:09.000000Z",
  },
  {
    id: 3,
    media_title: "Youtube",
    media_link: "https://www.youtube.com/",
    media_icon: "/youtube_1.svg",
    status: 1,
    created_at: "2022-07-23T10:14:50.000000Z",
    updated_at: "2023-06-02T11:53:13.000000Z",
  },
  {
    id: 2,
    media_title: "Twitter",
    media_link: "https://twitter.com/",
    media_icon: "/twitter_1.svg",
    status: 1,
    created_at: "2022-07-23T10:13:54.000000Z",
    updated_at: "2023-02-23T09:46:15.000000Z",
  },
  {
    id: 1,
    media_title: "Facebook",
    media_link: "https://www.facebook.com/",
    media_icon: "/facebook-logo_1.svg",
    status: 1,
    created_at: "2022-05-05T12:16:31.000000Z",
    updated_at: "2023-06-02T11:52:41.000000Z",
  },
];

const Footer = () => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const { isLoggedIn, customPageData, logo, socialData, copyright_text } =
    useSelector((state: RootState) => state.user);

  return (
    <>
      {customPageData && copyright_text && (
        <footer className="footer-area pt--70">
          <div className="footer-top">
            <div className="container-4xl">
              <div className="row">
                <div className="col-lg-2 col-md-6 col-sm-6 mb-30">
                  <div className="cp-user-logo">
                    <Link href="/">
                      <a href="">
                        <img
                          src={logo || ""}
                          className="img-fluid cp-user-logo-large"
                          alt=""
                        />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-6 mb-30">
                  <div className="single-wedgets text-widget">
                    <div className="widget-title">
                      <h4>
                        {customPageData?.custom_page_list[0]?.name
                          ? customPageData?.custom_page_list[0]?.name
                          : t("About Us")}
                      </h4>
                    </div>
                    <div className="widget-inner">
                      <ul>
                        {parseInt(settings?.blog_news_module) === 1 && (
                          <li>
                            <Link href={"/blog"}>{t("Blog")}</Link>
                          </li>
                        )}
                        {parseInt(settings?.enable_staking) === 1 && (
                          <li>
                            <Link href={"/staking"}>{t("Staking")}</Link>
                          </li>
                        )}

                        {parseInt(settings?.knowledgebase_support_module) ===
                          1 && (
                          <li>
                            <Link
                              href={
                                isLoggedIn === true ? "/support" : "/signin"
                              }
                            >
                              {t("Support")}
                            </Link>
                          </li>
                        )}
                        {parseInt(settings?.knowledgebase_support_module) ===
                          1 && (
                          <li>
                            <Link href={"/knowledgebase"}>
                              {t("Knowledgebase")}
                            </Link>
                          </li>
                        )}
                        {parseInt(settings?.blog_news_module) === 1 && (
                          <li>
                            <Link href={"/news"}>{t("News")}</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-md-6 col-sm-6 mb-30">
                  <div className="single-wedgets text-widget">
                    <div className="widget-title">
                      <h4>
                        {customPageData?.custom_page_list[1]?.name
                          ? customPageData?.custom_page_list[1]?.name
                          : t("Products")}
                      </h4>
                    </div>
                    <div className="widget-inner">
                      <ul>
                        {customPageData?.links?.map(
                          (item: any, index: any) =>
                            item.type === 1 && (
                              <li key={index}>
                                {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                                  <Link href={"/" + item.key}>
                                    {item.title}
                                  </Link>
                                ) : (
                                  <a
                                    href={item.page_link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {item.title}
                                  </a>
                                )}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-md-6 col-sm-6 mb-30">
                  <div className="single-wedgets text-widget">
                    <div className="widget-title">
                      <h4>
                        {customPageData?.custom_page_list[2]?.name
                          ? customPageData?.custom_page_list[2]?.name
                          : t("Service")}
                      </h4>
                    </div>
                    <div className="widget-inner">
                      <ul>
                        {customPageData?.links?.map(
                          (item: any, index: any) =>
                            item.type === 2 && (
                              <li key={index}>
                                {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                                  <Link href={"/" + item.key}>
                                    {item.title}
                                  </Link>
                                ) : (
                                  <a
                                    href={item.page_link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {item.title}
                                  </a>
                                )}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-6 mb-30">
                  <div className="single-wedgets text-widget">
                    <div className="widget-title">
                      <h4>
                        {customPageData?.custom_page_list[3]?.name
                          ? customPageData?.custom_page_list[3]?.name
                          : t("Support")}
                      </h4>
                    </div>
                    <div className="widget-inner">
                      <ul>
                        {customPageData?.links?.map(
                          (item: any, index: any) =>
                            item.type === 3 && (
                              <li key={index}>
                                {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                                  <Link href={"/" + item.key}>
                                    {item.title}
                                  </Link>
                                ) : (
                                  <a
                                    href={item.page_link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {item.title}
                                  </a>
                                )}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-6">
                  <div className="single-wedgets social-link">
                    <div className="widget-title">
                      <h4>
                        {customPageData?.custom_page_list[4]?.name
                          ? customPageData?.custom_page_list[4]?.name
                          : t("Community")}
                      </h4>
                    </div>
                    <div className="widget-inner">
                      <ul className="d-flex flex-wrap align-items-center gap-20">
                        {socialData?.length > 0 ? (
                          socialData?.map((social: any, index: any) => (
                            <li key={index}>
                              <a
                                href={social.media_link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={social.media_icon}
                                  alt={social.media_title}
                                  width={20}
                                />
                              </a>
                            </li>
                          ))
                        ) : process.env.NEXT_PUBLIC_DEMO_MODE == "1" ? (
                          socialDefaltData?.map((social: any, index: any) => (
                            <li key={index}>
                              <a
                                href={social.media_link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={social.media_icon}
                                  alt={social.media_title}
                                  width={20}
                                />
                              </a>
                            </li>
                          ))
                        ) : (
                          <></>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <div className="footer-bottom-wrap">
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <div className="copyright-area text-center text-md-center">
                      <p>
                        {(copyright_text && copyright_text) ||
                          t("Copyright@2022")}{" "}
                        <a href="">{settings?.app_title ?? t("TradexPro")}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
