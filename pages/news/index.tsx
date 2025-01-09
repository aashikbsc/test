import { NewsList } from "components/News/NewsList";
import { NewsSlider } from "components/News/NewsSlider";
import Footer from "components/common/footer";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { NewsHomePageAction } from "state/actions/news";
import Pagination from "components/Pagination/Pagination";
import { Search } from "components/common/search";
import { getBlogNewsSettings } from "service/news";
import { NewsSearchAction } from "state/actions/news";

const News = ({ BlogNewsSettings }: any) => {
  const { t } = useTranslation("common");
  const [PopularNewsData, setPopularNews] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [recentNewsData, setRecentNews] = useState<any>(
    // RecentNews?.data?.data ? RecentNews?.data?.data : []
    []
  );
  const [links, setLinks] = useState();
  // RecentNews?.data?.links ? RecentNews?.data?.links : []
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const getIt = async () => {
    setLoading(true);
    const { Categories, PopularNews, RecentNews } = await NewsHomePageAction();
    setRecentNews(RecentNews?.data?.data ? RecentNews?.data?.data : []);
    setPopularNews(PopularNews);
    setcategories(Categories?.data);
    setLoading(false);
  };
  useEffect(() => {
    getIt();
  }, []);
  return (
    <>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title text-center">
            {t("Top news")}
          </h2>

          <div className="mt-5 row">
            <div className="col-md-6 offset-md-3">
              {parseInt(BlogNewsSettings?.news_search_enable) === 1 && (
                <Search searchFunction={NewsSearchAction} linkName={"news"} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container inner-section-margin-top mt-5">
        <NewsSlider PopularNews={PopularNewsData?.data?.data} />
        <NewsList
          recentNewsData={recentNewsData}
          setRecentNews={setRecentNews}
          categories={categories}
          loading={loading}
          setLoading={setLoading}
          setLinks={setLinks}
          setSelected={setSelected}
          selected={selected}
        />
        {recentNewsData.length !== 0 && (
          <Pagination
            setRecentNews={setRecentNews}
            links={links}
            setLinks={setLinks}
            setLoading={setLoading}
            selected={selected}
          />
        )}
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  // const { Categories, PopularNews, RecentNews } = await NewsHomePageAction();
  const { data: BlogNewsSettings } = await getBlogNewsSettings();
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
      // PopularNews: PopularNews,
      // RecentNews: RecentNews,
      // categories: Categories?.data,
      BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default News;
