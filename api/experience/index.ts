import { resourceListHandler } from "../_lib/resource.js";

export default resourceListHandler({
  table: "experience",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
