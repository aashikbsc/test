import useTranslation from "next-translate/useTranslation";

export const P2pPaymentMethod = ({ data }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="container-4xl px-0 my-5">
      <div className="row align-items-center payment_box p-4 px-md-4 py-md-5 mx-2 mx-sm-0 glass-color-bg-custom">
        <div className="col-md-12">
          <h2>{t(`Top Payment Methods`)}</h2>
        </div>
        <div className="col-md-12 pb-4 mt-4">
          <div className="row row-gap-20">
            {data.payment_method_landing.map((data: any, index: any) => (
              <div className="col-sm-6 col-lg-4" key={index}>
                <a
                  className="paymentBox d-flex align-items-center p-3 gap-10"
                  href=""
                >
                  {data?.logo ? (
                    <img
                      src={data?.logo}
                      alt="logo"
                      className="h-full w-full max-w-20 max-h-20"
                    />
                  ) : (
                    <div></div>
                  )}

                  {data?.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
