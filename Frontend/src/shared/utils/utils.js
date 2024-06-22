import axios from "axios";
const resources = {};

const makeRequestCreator = () => {
  let cancel;

  return async (query, headers) => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (resources[(query, headers)]) {
        // Return result if it exists
        return resources[(query, headers)];
      }
      const res = await axios(query, headers, { cancelToken: cancel.token });

      const result = res.data.questions;
      // Store response
      resources[query] = result;

      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log("Request canceled", error.message);
      } else {
        // Handle usual errors
        console.log("Something went wrong: ", error.message);
      }
    }
  };
};

export const search = makeRequestCreator();
