import React, { useEffect } from "react";

export default function SelectWithdrawl({
  setSelectedMethod,
  depositInfo,
  selectedMethod,
}: any) {
  useEffect(() => {
    if (!depositInfo || depositInfo?.length === 0) return;
    setSelectedMethod({
      method: depositInfo[0] && depositInfo[0].payment_method,
      method_id: depositInfo[0] && depositInfo[0].id,
    });
  }, [depositInfo]);

  if (depositInfo?.length === 0) return <></>;

  return (
    <div className="d-flex mb-5 flex-wrap">
      {depositInfo?.map((payment: any, index: number) => (
        <div
          key={index}
          className={
            selectedMethod.method_id === payment.id
              ? "select-deposit-method-item-active"
              : "select-deposit-method-item"
          }
          onClick={() => {
            setSelectedMethod({
              method: payment.payment_method,
              method_id: payment?.id,
            });
          }}
        >
          {payment.title}
        </div>
      ))}
    </div>
  );
}
