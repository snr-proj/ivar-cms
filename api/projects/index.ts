import { resourceListHandler } from "../_lib/resource";

export default resourceListHandler({
  table: "projects",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
