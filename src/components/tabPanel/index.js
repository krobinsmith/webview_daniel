import React from "react";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  if (index !== value) return null;
  return <div {...other}>{children}</div>;
};

export default TabPanel;
