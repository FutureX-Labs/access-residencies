import { useState, useEffect } from "react";

const UseSessionStorage = (name) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(sessionStorage.getItem(name));
  }, [name]);

  return value;
};

export default UseSessionStorage;
