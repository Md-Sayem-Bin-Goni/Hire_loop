import { getJobs } from '@/lib/api/jobs';
import React from 'react';



const BrowseJobsPage = async({searchParams} : {searchParams : Promise<{[key: string]: string | string[]| undefined}>}) => {

    const search = await searchParams;
    const urlsearch = new URLSearchParams(search as Record<string,string>)
    const query = urlsearch.toString()

    console.log(query);

    const jobs = await getJobs(query)

    return (
        <div>
            <h2>Brows jobs page</h2>
            <ul>
                {
                    jobs.map((job)=>(
                        <li key={job._id}>
                        {job.companyName}
                    </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default BrowseJobsPage;