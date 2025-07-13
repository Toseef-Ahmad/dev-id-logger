import { setDevId, log, debug } from "dev-id-logger";

setDevId(process.env.REACT_APP_DEV_ID);

log("My debug log");
debug("Breakpoint only for me"); // Only triggers if dev ID matches
