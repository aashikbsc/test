import React from "react";

const SellingSection = ({ data }: any) => {
  return (
    <section className="mt-5">
      <div className="container-4xl">
        <div className="section-title">
          <h1>{data?.launchpad_why_choose_us_text}</h1>
        </div>
        <div className="row">
          {data?.feature_list?.map((item: any, index: number) => (
            <div key={index} className="col-lg-3 col-md-6">
              <a className="single-card boxShadow">
                <img
                  className="card-icon"
                  src={item.image ? item.image : "/chooseOne.svg"}
                  alt="icon"
                />
                <h3 className="card-title">{item.title}</h3>
                <p className="card-content">{item.description}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellingSection;
