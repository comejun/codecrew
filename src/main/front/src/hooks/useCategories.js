import { useEffect, useState } from "react";
import axios from "axios";

const useCategories = (host) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    axios
      .get(`${host}/api/categories`)
      .then((response) => {
        setCategories({ ...response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [host]);

  return categories;
};

export default useCategories;
