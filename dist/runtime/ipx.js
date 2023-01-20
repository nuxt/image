import { createIPX, createIPXMiddleware } from "ipx";
const ipx = createIPX("__IPX_OPTIONS__");
export default createIPXMiddleware(ipx);
