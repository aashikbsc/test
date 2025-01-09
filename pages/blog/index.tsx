import CardSection from "components/Blog/CardSection";
import SliderCover from "components/Blog/SliderCover";
import TabSection from "components/Blog/TabSection";
import Footer from "components/common/footer";
import { Search } from "components/common/search";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { getBlogNewsSettings } from "service/news";
import { BlogHomePageAction, BlogSearchAction } from "state/actions/blog";

const Index = ({}: any) => {
  const [loading, setLoading] = useState(false);
  const [featuredBlogs, setfeaturedBlogs] = useState<any>();
  const [categories, setcategories] = useState();
  const [BlogNewsSettings, setBlogNewsSettings] = useState<any>(false);
  const [recentBlogsState, setRecentBlogState] = useState([]);

  const getIt = async () => {
    setLoading(true);
    const { FeaturedBlogs, RecentBlogs, Categories } =
      await BlogHomePageAction();
    setfeaturedBlogs(FeaturedBlogs.data);
    setRecentBlogState(RecentBlogs.data.data);
    setcategories(Categories.data);
    const { data: BlogNewsSettings } = await getBlogNewsSettings();
    setBlogNewsSettings(BlogNewsSettings);
    setLoading(false);
  };
  useEffect(() => {
    getIt();
  }, []);
  return (
    <>
      <div className="">
        <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
          <div className="profle-are-top container-4xl">
            <h2 className="wallet-overview-header-title text-center">
              {BlogNewsSettings?.blog_feature_heading}
            </h2>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <p className="text-center text-white">
                  {BlogNewsSettings?.blog_feature_description}
                </p>
              </div>
            </div>

            <div className="mt-5 row">
              <div className="col-md-6 offset-md-3">
                {parseInt(BlogNewsSettings?.blog_search_enable) === 1 && (
                  <Search searchFunction={BlogSearchAction} linkName={"blog"} />
                )}
              </div>
            </div>
          </div>
        </div>
        <PlaceTopLeft />
        <PlaceBottomRight />
      </div>
      <div className="container">
        <SliderCover featuredblogs={featuredBlogs?.data} />
        <TabSection
          categories={categories}
          setRecentBlogState={setRecentBlogState}
          setLoading={setLoading}
        />
        <CardSection blogs={recentBlogsState} loading={loading} />

        {/* <Pagination /> */}
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  // const { FeaturedBlogs, RecentBlogs, Categories } = await BlogHomePageAction(
  //   ctx.locale
  // );
  // const cookies = parseCookies(ctx);
  // const response = await GetUserInfoByTokenServer(cookies.token);
  // const { data: BlogNewsSettings } = await getBlogNewsSettings();
  const commonRes = await pageAvailabilityCheck();
  if (parseInt(commonRes.blog_news_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      // featuredBlogs: FeaturedBlogs.data,
      // recentBlogs: RecentBlogs.data,
      // categories: Categories?.data,
      // BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default Index;
