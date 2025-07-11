import React from "react";

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex gap-6 mt-4">
      <div className="form-control">
        <label
          className={`label gap-3 cursor-pointer`}
          style={{ color: selectedGender === "male" ? "#00ADB5" : "#EEEEEE" }}
        >
          <span className="label-text text-sm font-medium">Male</span>
          <input
            type="checkbox"
            className="checkbox"
            style={{
              borderColor: "#00ADB5",
              backgroundColor:
                selectedGender === "male" ? "#00ADB5" : "transparent",
            }}
            checked={selectedGender === "male"}
            onChange={() => onCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label gap-3 cursor-pointer`}
          style={{ color: selectedGender === "female" ? "#00ADB5" : "#EEEEEE" }}
        >
          <span className="label-text text-sm font-medium">Female</span>
          <input
            type="checkbox"
            className="checkbox"
            style={{
              borderColor: "#00ADB5",
              backgroundColor:
                selectedGender === "female" ? "#00ADB5" : "transparent",
            }}
            checked={selectedGender === "female"}
            onChange={() => onCheckboxChange("female")}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
