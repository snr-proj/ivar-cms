import { resourceListHandler } from "../_lib/resource.js";   // or resourceItemHandler

export default resourceListHandler({
  table: "projects",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
