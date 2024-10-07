import moment from "moment";
import "moment/locale/id"; // without this line it didn't work
moment.locale("id");

export function dateFormat(time, format = "DD-MM-YYYY") {
  const result = moment.utc(time).local().format(format) || "";
  return result !== "Invalid date" ? result : "-";
}

export default dateFormat;
