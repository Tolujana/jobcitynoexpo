import axios from "axios";
const apiBaseUrl = "http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/?";
const apiBaseUrls = "http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/";
const apipi = "http://api.github.com/repos/TanStack/query";
const categoryEndPoint = (pageparam, firstTerm, secondTerm) => {
  console.log("thisisthenumer", pageparam);
  return `${apiBaseUrl}search=${firstTerm}&page=${pageparam}&number=7`;
};
let data;
// ${secondTerm ? `&search=${secondTerm}` : ""}
// const newApiCall = async (endPoint, params) => {

//   const options = {
//     method: "GET",
//     url: endPoint,
//     params: params ? params : {},
//   };

//   try {
//     const response = await axios.request(options);
//     //console.log(response.data, "from APsssi");
//     return response.data;
//   } catch (error) {
//     console.log(error, "from sAPi");
//     return {};
//   }
// };

export const fetchCategoryJobs = async (Pageparam, firstTerm, secondTerm, params) => {
  const endPoint = categoryEndPoint(Pageparam, firstTerm, secondTerm);
  const options = {
    method: "GET",
    url: endPoint,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);

    return { data: response.data.posts };
  } catch (error) {
    console.log(error, "from sAPi");
    return {};
  }
};
