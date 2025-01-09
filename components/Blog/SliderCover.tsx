import { formateDateMunite } from "common";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
const SliderCover = ({ featuredblogs }: any) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
    <div className="mt-4">
      <Slider className="blogSlider" {...settings}>
        {featuredblogs?.map((featuredblog: any, index: any) => (
          <Link href={"/blog/" + featuredblog?.post_id} key={index}>
            <a className="overflow-hidden max-h-350 rounded-10 mt-4 glass-color-bg-custom d-block ">
              <div className="row">
                <div className="col-md-5">
                  <img
                    className="SliderBlog rounded"
                    src={featuredblog?.thumbnail}
                  />
                </div>
                <div className="col-md-7 blogSliderText p-3">
                  <h1 className="pt-4 pb-3 pt-md-0 titleText">
                    {featuredblog?.title}
                  </h1>
                  <p>
                    {" "}
                    {featuredblog?.description?.length > 100
                      ? `${featuredblog?.description.slice(0, 100)}...`
                      : featuredblog?.description}
                  </p>
                  <p>
                    {" "}
                    <small>{formateDateMunite(featuredblog?.created_at)}</small>
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default SliderCover;
