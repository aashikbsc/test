import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { launchpadCreateUpdatePhaseAdditionalAction } from "state/actions/launchpad";
import { getAdditionalPhaseDetails } from "service/launchpad";
import { parseCookies } from "nookies";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import Footer from "components/common/footer";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";

const CreateEditAdditionalPhase = ({ id, edit, data }: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const [inputFields, setInputFields] = useState<any>([
    { value: "", title: "", file: "" },
  ]);
  const [loading, setLoading]: any = useState<any>(false);
  const handleFormChange = (index: any, event: any) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };
  const handleFormFileChange = (index: any, event: any) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.files[0];
    setInputFields(data);
  };
  const addFields = () => {
    let newfield = { value: "", title: "", file: "" };
    setInputFields([...inputFields, newfield]);
  };

  const getEditData = () => {
    let tempArray: any = [];
    data.map((item: any) => {
      tempArray.push({ value: item.value, title: item.title, file: item.file });
    });
    setInputFields(tempArray);
  };
  useEffect(() => {
    if (edit) getEditData();
  }, []);
  return (
    <>
      <div>
        <MarketOverviewHeader
          title={t(`${edit ? "Edit" : "Add"}  Additional Info`)}
        />
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="container-4xl">
          <div className="shadow-sm section-padding-custom wallet-card-info-container mb-5 margin-n-top-60 margin-bottom-30">
            <div className="row">
              <div className="">
                <div className="col-12">
                  <div
                    onClick={() => {
                      router.back();
                    }}
                    className="cursor-pointer mb-4 text-18"
                  >
                    <BiArrowBack />
                    Back
                  </div>
                  <button
                    className="primary-btn mt-3 d-flex justify-content-center align-items-center gap-10"
                    onClick={addFields}
                  >
                    <IoMdAdd />
                    {t("Add Field")}
                  </button>
                </div>
                <div className="ico-create-form col-12">
                  <form
                    className="row"
                    onSubmit={(e) => {
                      e.preventDefault();

                      launchpadCreateUpdatePhaseAdditionalAction(
                        inputFields,
                        id,
                        setLoading
                      );
                    }}
                  >
                    {inputFields.map((item: any, index: any) => (
                      <>
                        <div className="col-md-4 form-input-div">
                          <label className="ico-label-box" htmlFor="">
                            {t("Title")}
                          </label>
                          <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                            value={item.title}
                            onChange={(event) => handleFormChange(index, event)}
                            className={`ico-input-box`}
                          />
                        </div>
                        <div className="col-md-4 form-input-div">
                          <label className="ico-label-box" htmlFor="">
                            {t("Value")}
                          </label>
                          <input
                            type="text"
                            name="value"
                            placeholder="Value"
                            value={item.value}
                            required
                            onChange={(event) => handleFormChange(index, event)}
                            className={`ico-input-box`}
                          />
                        </div>
                        <div className="col-md-4 form-input-div">
                          <label className="ico-label-box" htmlFor="">
                            {t("File")}
                          </label>
                          <input
                            type="file"
                            name="file"
                            placeholder="File"
                            onChange={(event) =>
                              handleFormFileChange(index, event)
                            }
                            className={`ico-input-box`}
                          />
                        </div>
                      </>
                    ))}

                    <div className="col-md-12 form-input-div">
                      <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn"
                      >
                        {loading
                          ? t("Loading..")
                          : t(`${edit ? "Edit" : "Add"} aditional data`)}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { id, edit } = ctx.query;
  await SSRAuthCheck(ctx, "/ico/applied-launchpad");
  const cookies = parseCookies(ctx);
  let additionalDetails = await getAdditionalPhaseDetails(id, cookies.token);

  return {
    props: {
      id: id,
      edit: additionalDetails.data.length > 0 ? true : false,
      data: additionalDetails.data.length > 0 ? additionalDetails.data : [],
    },
  };
};
export default CreateEditAdditionalPhase;
