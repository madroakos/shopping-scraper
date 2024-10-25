'use client'
import { Product } from "@/app/types/product";
import axios from "axios";
import { useState } from "react";

export default function ProductSearch( {product, setProduct, outerLoading}: {product: Product | null, setProduct: (product: Product) => void, outerLoading: (isLoading: boolean) => void} ) {
    const [loading, setLoading] = useState(false);
    const [linkToUseForFetch, setLinkToUseForFetch] = useState('');

    return(
        <div className='flex w-full gap-2'>
            <button className='btn btn-error'>X</button>
            <label className="input input-bordered flex items-center gap-2 px-0 w-full">
            <input type="text" className="grow" placeholder="URL" value={linkToUseForFetch} onChange={(e) => setLinkToUseForFetch(e.target.value)}/>
            <button type="button" className='btn btn-primary' onClick={addUrl}>Search</button>
            </label>
            {loading && <span className="loading loading-spinner loading-xs"></span>}
            </div>
    )

    async function addUrl() {
        setLoading(true);
        outerLoading(true);
        try {
            const result = await axios.get(`/api/scrape-data?url=${(linkToUseForFetch.toString())}`);

            if (product) {
                setProduct({
                    ...product,
                    shops: [...product.shops, result.data.shops[0]]
                });
            } else {
                setProduct(result.data);
            }
        }
        catch(error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            outerLoading(false);
        }
    }
}