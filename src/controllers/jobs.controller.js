import { cache } from "../../src/intances/cache.js";
import { jobslisting } from "../utils/jobsFetchingByLLm.js";


export const findJobsAndListing = async(req, res) => {

    const id  = req.params.id

    const data = cache.get(id);
    console.log(data);
    console.log('finding');
    try {
        const jobs = await jobslisting(data);

        console.log(jobs);
        return res.render('jobs');
    } catch (error) {   
        console.log('error from catch block ' + error);
        return res.render('jobs');
    }
    
    console.log('finding done');

    

}