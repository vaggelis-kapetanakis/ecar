import React from "react";
import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../../../../shared/utils/creditCardFormat";
import styles from "../../../../style";

const Payment = ({ formData, setFormData }) => {
  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setFormData({ ...formData, issuer: issuer });
    }
  };

  const handleInputFocus = ({ target }) => {
    setFormData({ ...formData, focused: target.name });
  };

  const handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formCardData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    setFormData({ ...formData, formCardData: formCardData });
  };

  return (
    <div className="flex md:flex-row xxs:flex-col md:gap-10 xxs:gap-y-10 w-auto md:px-20 xxs:px-0 py-10">
      <div
        className="w-full md:px-10 xxs:px-0 flex md:flex-row xxs:flex-col-reverse items-center
      justify-between"
      >
        <form className="md:w-full flex md:items-end md:justify-end xxs:items-center xxs:justify-center flex-col md:gap-5 xxs:gap-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="tel"
              name="number"
              className={`${styles.respFontExtraSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
            outline-none font-normal placeholder:text-gray-600 focus:border-2
            focus:border-loginBorder transition-all duration-300 ease-in-out 
            autofill:!bg-dark1 autofill:focus:!bg-dark1 tracking-wider `}
              placeholder="Card Number"
              pattern="[\d| ]{16,22}"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <small className={`${styles.respFontTiny} text-gray-400 pt-1 ml-5 self-start`}>
              E.g.: 49..., 51..., 36..., 37...
            </small>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className={`${styles.respFontExtraSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 tracking-wider `}
              placeholder="Name"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="form-input-bottom-two">
            <input
              type="tel"
              name="expiry"
              className={`${styles.respFontExtraSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 tracking-wider `}
              placeholder="Valid Thru"
              pattern="\d\d/\d\d"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="form-input-bottom-two">
            <input
              type="tel"
              name="cvc"
              className={`${styles.respFontExtraSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 tracking-wider `}
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <input type="hidden" name="issuer" value={formData.issuer} />
        </form>
        <div
          className="w-full h-full flex items-start justify-start
      py-[10%] md:scale-100 xxs:scale-75 antialiased"
        >
          <Card
            number={formData.number}
            name={formData.name}
            expiry={formData.expiry}
            cvc={formData.cvc}
            focused={formData.focused}
            callback={handleCallback}            
          />
        </div>
      </div>

      {/* {formData && (
        <div className="App-highlight">
          {formatFormData(formData).map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Payment;
