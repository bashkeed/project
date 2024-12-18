import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const QuitConfirmation = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed-top d-flex align-items-center justify-content-center bg-opacity-50 vh-100">
      <div
        className="bg-white p-4 rounded shadow-lg w-100 mx-2 mx-md-5 mx-lg-0"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="h5 mb-4">Are you sure you want to Submit?</h2>
        <div className="d-flex justify-content-between">
          <button onClick={onClose} className="btn btn-secondary mr-2">
            No
          </button>
          <button onClick={onConfirm} className="btn btn-success">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitConfirmation;
