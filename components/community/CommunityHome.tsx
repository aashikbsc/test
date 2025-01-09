import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsChevronRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getBlogHomePageDataApi } from "service/landing-page";
import { RootState } from "state/store";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { formateDateMunite } from "common";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";

const CommunityHome = () => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation();

  const [blogList, setBlogList] = useState<any>([]);
  const [isSuccess, setIsSuccess] = useState<any>(false);
  const [loading, setLoading] = useState(false);

  const {
    blog_section_heading,
    blog_section_description,
    blog_section_banner_description,
    blog_section_banner_image,
  } = settings;

  useEffect(() => {
    getBlogHomePageData();
  }, []);

  const getBlogHomePageData = async () => {
    setLoading(true);
    const response = await getBlogHomePageDataApi();
    if (!response.success) {
      setLoading(false);
      return;
    }
    setBlogList(response.data);
    setLoading(false);
    setIsSuccess(true);
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  if (loading) return <SectionLoading />;

  if (!isSuccess) return <></>;

  return (
    <section className="pt-60 pb-60 community-home">
      <div className="container-4xl market-trend-area-container px-5">
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="community-home-header">
          <div className="community-home-title-section">
            <h3 className="community-home-title">
              {blog_section_heading ?? "Trending on TradexPro Feed"}
            </h3>
            <Link href={`/blog`}>
              <span className="community-home-btn">
                <span>{t(`View More`)}</span>
                <span>
                  <BsChevronRight size={12} />
                </span>
              </span>
            </Link>
          </div>

          <h4 className="community-home-subtitle">
            {blog_section_description ??
              "Discover the latest crypto news and feed from news media and influencers."}
          </h4>
        </div>

        <div className="community-home-body row">
          <div className="col-lg-8">
            {blogList.length > 0 ? (
              <div className="row">
                {blogList.map((item: any, index: any) => (
                  <motion.div
                    className="col-md-6"
                    key={index}
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="community-item">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="community-svg"
                          >
                            <path
                              d="M12.24 8L8 12.24l4.24 4.24 4.24-4.24L12.24 8zm-1.41 4.24l1.41-1.41 1.41 1.41-1.41 1.41-1.41-1.41z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <div className="d-flex gap-10 align-items-center">
                            <img
                              className="community-user-img"
                              src={item?.thumbnail ?? "/user.jpeg"}
                              alt=""
                            />
                            <span>{item?.category}</span>
                          </div>
                          <Link href={`blog/${item?.slug}`}>
                            <div className="community-item-des cursor-pointer">
                              <p>{item?.body?.substring(0, 80)}...</p>
                            </div>
                          </Link>
                          <p className="community-item-time">
                            {formateDateMunite(item?.publish_at)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <NoItemFound />
            )}
          </div>
          <div className="col-lg-4">
            <div className="community-home-card">
              <div className="text-center">
                <img
                  className="community-card-img"
                  src={blog_section_banner_image ?? "/community-card.png"}
                  alt=""
                />
              </div>
              <div className="community-card-title-section">
                <h3 className="community-card-title">
                  {blog_section_banner_description ??
                    "World's largest crypto community"}
                </h3>
                <Link href={`/blog`}>
                  <button className="community-card-btn">
                    {t(`Explore now`)}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHome;
