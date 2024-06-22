import React from "react";
import styles from "../../style";
import { MdOutlineContentCopy } from "react-icons/md";
import notifierMiddleware from "../Notifier/Notifier";

const copyToClipboard = (textToCopy) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => notifierMiddleware("info", "Copied to Clipboard"))
    .catch((err) => notifierMiddleware("warning", "Something went wrong"));
};

const InfoLayout = ({ title, data }) => {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <h1
        className={`${styles.respFontExtraSmall} max-w-[7rem] w-full max-h-[2rem] text-gray-300 mr-4`}
      >
        {title}
      </h1>
      <div className="max-w-[14rem] w-full flex flex-row py-1 items-center justify-between border-2 border-lightWhite rounded-xl">
        <span
          className={`max-w-[10rem] text-ellipsis overflow-hidden whitespace-nowrap 
      ${styles.respFontExtraSmall} leading-relaxed text-white px-2`}
        >
          {data}
        </span>
        <MdOutlineContentCopy
          className="w-5 h-5 mx-1 my-1 text-white"
          onClick={() => copyToClipboard(data)}
        />
      </div>
    </div>
  );
};

const Modal = ({ showModal, setShowModal, data }) => {
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none
          animate-popUp z-[9999]"
          >
            <div className="relative w-auto my-6 mx-6 max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-[rgb(5,15,50)] outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3
                    className={`${styles.respFontNormal} text-white font-semibold`}
                  >
                    Vehicle Information
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-3 flex flex-col flex-auto gap-5">
                  <InfoLayout title="ID:" data={data.id} />
                  <InfoLayout title="VehicleID:" data={data.vehicleId} />
                  <InfoLayout title="Brand:" data={data.brand} />
                  <InfoLayout title="Type:" data={data.type} />
                  <InfoLayout title="Model:" data={data.model} />
                  <InfoLayout
                    title="Average Consumption:"
                    data={data.average_consumption}
                  />
                  <InfoLayout title="Release Year:" data={data.release_year} />
                  {/* <div className="flex flex-row items-center justify-between">
                    <h1
                      className={`${styles.respFontNormal} max-w-[7rem] text-gray-300`}
                    >
                      ID:
                    </h1>
                    <div className="max-w-[14rem] w-full flex flex-row py-1 items-center justify-between border-2 border-lightWhite rounded-xl">
                      <span
                        className={`max-w-[12rem] text-ellipsis overflow-hidden whitespace-nowrap 
                        ${styles.respFontNormal} text-white px-2`}
                      >
                        {data.id}
                      </span>
                      <MdOutlineContentCopy className="w-5 h-5 mx-1 my-1 text-white" />
                    </div>
                  </div> */}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className={`text-danger-500 background-transparent font-bold ${styles.respFontSmaller} outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
