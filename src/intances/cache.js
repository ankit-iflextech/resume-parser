import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 2400 }); // data expires in 40 minutes