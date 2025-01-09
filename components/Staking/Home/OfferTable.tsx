import React, { useEffect, useState } from "react";
import { getOfferListAction } from "state/actions/staking";
import OfferRow from "./OfferRow";
import SectionLoading from "components/common/SectionLoading";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import useTranslation from "next-translate/useTranslation";

const OfferTable = ({ isLoggedIn }: any) => {
  const { t } = useTranslation("common");

  const [offers, setOffers] = useState<any>([]);
  const [loading, setloading] = useState<any>(false);
  useEffect(() => {
    getOfferListAction(setOffers, setloading);
  }, []);
  return (
    <div>
      <div className="container-4xl margin-n-top-60 margin-bottom-30">
        <div className="row shadow-sm section-padding-custom wallet-card-info-container">
          <div className="table-responsive overflow-x-hidden">
            {loading ? (
              <SectionLoading />
            ) : (
              <>
                {offers?.coin_type?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="p-l-10 p-r-10">
                          {t(`Token`)}
                        </th>
                        <th scope="col" className="p-l-10 p-r-10">
                          {t(`Minimum Amount`)}
                        </th>
                        <th scope="col" className="p-l-10 p-r-10">
                          {t(`Est. APR`)}
                        </th>
                        <th scope="col" className="p-l-10 p-r-10">
                          {t(`Duration Days`)}
                        </th>
                        <th scope="col" className="p-l-10 p-r-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers?.coin_type?.map((item: any, index: any) => (
                        <OfferRow
                          key={index}
                          offers={offers}
                          item={item}
                          isLoggedIn={isLoggedIn}
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <NoItemFound />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferTable;
