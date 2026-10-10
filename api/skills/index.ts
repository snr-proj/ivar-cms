import { resourceListHandler } from "../_lib/resource";

export default resourceListHandler({
  table: "skills",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
