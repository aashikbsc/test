import SupportHeader from "components/Support/SupportHeader";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import SupportSidebar from "layout/supportSidebar";
import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  SupportCreateTicket,
  knowledgebaseSupportProjectList,
  siteSettingResource,
} from "service/knowledgebase";
import { customPage, landingPage } from "service/landing-page";

const TicketCreate = () => {
  const { t } = useTranslation("common");

  const [projectList, setProjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [options, setOptions] = useState<any>({
    project: "",
    title: "",
    description: "",
    purchase_code: "",
  });
  const [file, setFile] = useState<any>();
  const router = useRouter();
  const getProjectList = async () => {
    const { data } = await knowledgebaseSupportProjectList();
    setProjectList(data?.project_list);
    setCategoryList(data?.category);
  };
  const createTicket = async () => {
    if (!options?.category) {
      toast.error("Please Select Category");
      return;
    }
    if (!options?.project) {
      toast.error("Please Select Project");
      return;
    }
    if (!options?.title) {
      toast.error("Please Add Title");
      return;
    }
    if (!options?.description) {
      toast.error("Please Add Description");
      return;
    }
    const formData = new FormData();
    // if (!options.title || options.project || options.description) {
    //   toast.error("Please fill all the fields!");
    //   return;
    // }
    formData.append("title", options.title);
    formData.append("category_id", options.category);
    formData.append("project_id", options.project);
    formData.append("description", options.description);
    formData.append("file[1]", file);
    options.purchase_code &&
      formData.append("purchase_code", options.purchase_code);

    const data = await SupportCreateTicket(formData);
    if (data.success) {
      toast.success(data.message);
      router.push("/support");
    } else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    getProjectList();
  }, []);
  return (
    <>
      <div className="page-wrap">
        {/* <SupportSidebar /> */}
        <div className="page-main-content">
          <SupportHeader title={t(`Create New Ticket`)} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <section className=" body-margin-top-custom">
              <div className="row shadow-sm section-padding-custom wallet-card-info-container">
                <div className="col-md-12 mx-auto">
                  <div className="">
                    {/* <h4 className="fw_600">{t(`Create New Ticket`)}</h4> */}
                    <input type="hidden" />
                    <div className="p_color pt-4 row row-gap-20">
                      <div className="col-md-6">
                        <label>{t(`Choose Category:`)}</label>
                        <select
                          id="inputState"
                          className="w-100 px-2 py-2 rounded search-field ticketFilterBg"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              category: e.target.value,
                            });
                          }}
                        >
                          <option selected value={""}>
                            {t(`Choose...`)}
                          </option>
                          {categoryList.map((category: any, index: any) => (
                            <option key={index} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>{t(`Choose Project:`)}</label>
                        <select
                          id="inputState"
                          className="w-100 px-2 py-2 rounded search-field ticketFilterBg"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              project: e.target.value,
                            });
                          }}
                        >
                          <option selected>{t(`Choose...`)}</option>
                          {projectList.map((project: any, index: any) => (
                            <option key={index} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label>{t(`Title :`)}</label>
                        <input
                          className="w-100 px-2 py-2 rounded search-field"
                          type="text"
                          name="title"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              title: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label>{t(`Description`)}</label>
                        <textarea
                          id="description"
                          name="description"
                          className="w-100 px-2 py-2 rounded search-field"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label>{t(`Purchase Code (optional) :`)}</label>
                        <input
                          className="w-100 px-2 py-2 rounded search-field"
                          type="text"
                          name="purchase_code"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              purchase_code: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label>{t(`Attach File:`)}</label>
                        <div className="input-group input-group-lg">
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input "
                              id="inputGroupFile01"
                              aria-describedby="inputGroupFileAddon01"
                              onChange={(e: any) => {
                                setFile(e.target.files[0]);
                              }}
                            />
                            <label className="custom-file-label custom_file_uploder px-2 py-2">
                              {t(`Choose file`)}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <button
                          className="btn btn-warning fw-bolder text-white mt-4 px-4 py-2 rounded"
                          onClick={createTicket}
                        >
                          {t(`Submit`)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/support");
  const commonRes = await pageAvailabilityCheck();
  const resorce = await siteSettingResource();
  if (parseInt(commonRes.knowledgebase_support_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      resorce: resorce,
    },
  };
};
export default TicketCreate;
