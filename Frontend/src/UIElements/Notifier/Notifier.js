import AWN from "awesome-notifications";
import "awesome-notifications/dist/index.var";
import "../../../node_modules/awesome-notifications/dist/style.css";
import "./notifier.css";

let globalOptions = {
  position: "top-right",
  animationDuration: 300,
};
let notifier = new AWN(globalOptions);

const notifierMiddleware = (method, message) => {
  if (method === "warning") {
    return notifier.warning(message);
  } else if (method === "success") {
    return notifier.success(message);
  } else if (method === "info") {
    return notifier.info(message);
  } else if (method === "alert") {
    return notifier.alert(message);
  } else {
    return notifier.tip(message);
  }
};

export default notifierMiddleware;
