
import { cache } from "../../src/intances/cache.js";

export const suggestionPage = (req, res) => {
    const id = req.params.id
    const data = cache.get(id);
    
    return res.render('suggestion', { data:data, id:id });
}