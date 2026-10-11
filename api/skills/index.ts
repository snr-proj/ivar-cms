import { resourceListHandler } from "../_lib/resource.js";

export default resourceListHandler({
  table: "skills",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
