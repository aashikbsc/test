import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";

import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { getBlogNewsSettings, getNewsDetails } from "service/news";
import { GetServerSideProps } from "next";
import { formateData } from "common";
import SocialShare from "components/common/SocialShare";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import CommentSection from "components/Blog/CommentSection";
import { PostCommentAction } from "state/actions/news";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading } from "state/reducer/user";

const NewsDetails = ({ BlogNewsSettings }: any) => {
  const [newsDetails, setnewsDetails] = useState<any>();

  const { t } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const getDetails = async (id: any) => {
    // dispatch(setLoading(true));
    const newsDetails = await getNewsDetails(id);
    setnewsDetails(newsDetails?.data);
    // dispatch(setLoading(false));
  };
  useEffect(() => {
    id && getDetails(id);
  }, [id]);
  return (
    <>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title text-center">
            {t(`News Details`)}
          </h2>
        </div>
      </div>
      <div className="container inner-section-margin-top my-5">
        <Link href="/news">
          <a>
            <h4 className="pb-3 newsDetailsTitle sectionTitle d-flex align-items-center">
              <BiChevronLeft />
              {t("Back")}
            </h4>
          </a>
        </Link>

        <div className="row">
          <div className="col-md-8">
            <div className="newsCardText mt-4">
              <h3 className="titleText">{newsDetails?.details?.title}</h3>
              <small>{formateData(newsDetails?.details?.created_at)}</small>
              <img
                className="rounded my-3 w-full max-h-350 object-position-center object-fit-cover"
                src={newsDetails?.details?.thumbnail}
                alt=""
              />
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: newsDetails?.details?.body,
                }}
              ></div>
            </div>
            {parseInt(BlogNewsSettings?.news_comment_enable) === 1 && (
              <CommentSection
                comments={newsDetails?.comments}
                post_id={newsDetails?.details?.post_id}
                PostCommentAction={PostCommentAction}
                comment_allow={newsDetails?.details?.comment_allow}
              />
            )}
          </div>
          <div className="col-md-4">
            <SocialShare
              url={
                process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL +
                "news/" +
                newsDetails?.details?.post_id
              }
            />
            <div className="newsCard p-4 ">
              {newsDetails?.related?.data.map((item: any, index: any) => (
                <div
                  className={
                    newsDetails?.related?.data?.length == index + 1
                      ? "border-b-none"
                      : "pb-4 mb-4 border-b-1 border-solid border-border-color"
                  }
                  key={index}
                >
                  <a href="">
                    <div className="row">
                      <div className="col-3">
                        <img
                          className="rounded object-position-center object-fit-cover w-69 h-69 min-h-69"
                          src={item.thumbnail}
                          alt=""
                        />
                      </div>
                      <div className="col-9">
                        <div className="newsCardText">
                          <p className="titleText padding-b-5 text-16 font-bolder leading-1-5">
                            {item.title}
                          </p>
                          <small>{formateData(item.created_at)}</small>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  // await SSRAuthCheck(ctx, "/news");
  const { id } = ctx.params;
  // const newsDetails = await getNewsDetails(id);
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
      // newsDetails: newsDetails.data,
      BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default NewsDetails;
