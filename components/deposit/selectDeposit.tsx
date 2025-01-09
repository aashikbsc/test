import React from "react";

const SelectDeposit = ({
  setSelectedMethod,
  depositInfo,
  selectedMethod,
}: any) => {
  return (
    <div className="d-flex mt-3 flex-wrap">
      {depositInfo?.payment_methods.map((payment: any, index: number) => (
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
};

export default SelectDeposit;
