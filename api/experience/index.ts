import { resourceListHandler } from "../_lib/resource";

export default resourceListHandler({
  table: "experience",
  defaultSort: "sort_order",
  defaultOrder: "asc",
});
