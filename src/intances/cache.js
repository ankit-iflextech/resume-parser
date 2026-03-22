import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 4800 }); // data expires in 80 minutes