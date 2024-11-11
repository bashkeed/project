import React from "react";
import { mdiReload } from "@mdi/js";
import Icon from "@mdi/react"; // Ensure you have the right import for your Icon component

const Loader = () => {
  return (
    <div className="loader">
      <Icon path={mdiReload} size={1} />
    </div>
  );
};

export default Loader;
