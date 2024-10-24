'use client';

import { useState } from 'react';
import axios from 'axios';
import ProductCard from '@/app/components/ProductCard/ProductCard';
import { Product } from '@/app/types/product';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
    const [url, setUrl] = useState('');
    // const [shop, setShop] = useState('');
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(url?.toString());
        // console.log(shop?.toString());

        // if (shop.toString() === 'Choose') {
        //     alert('Please select a shop');
        //     return;
        // } else {
            setLoading(true);
            try {
                const result = await axios.get(`/api/scrape-data?url=${(url.toString())}`);
                setProduct(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        // }
    };

    return (
        <>
        <button className='btn btn-primary ml-6' onClick={router.back}>Back</button>
        <div className='p-6 m-auto md:w-3/4 lg:w-1/2 2xl:w-1/3'>
            <h1 className='font-bold p-1'>Add a product</h1>
            <form onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 pr-0">
            <input type="text" className="grow" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)}/>
            <button type="submit" className='btn btn-primary'>Submit</button>
            </label>
            </form>

            {loading ? (
                <Skeleton />
            ) : (
                product && (
                <div className='flex flex-col gap-3 mt-3'>
                    <ProductCard product={product} deletable={false}/>
                    <button className='btn btn-primary' onClick={onSave}>Save</button>
                </div>
                )
            )}
        </div>
        </>
    );

    function Skeleton() {
        return (
            <div className='flex flex-row justify-center mt-6'>
                <div className="skeleton w-[90vw] h-[30vh]"></div>
            </div>
        )
    }

    function onSave() {
        let data: Product[] = [];
    
        if (window.localStorage.getItem('data')) {
            const encodedData = window.localStorage.getItem('data') || '[]';
            const decodedData = new TextDecoder().decode(Uint8Array.from(atob(encodedData), c => c.charCodeAt(0)));
            data = JSON.parse(decodedData);
        }
    
        if (product && product.name && data.some(p => p.name === product.name)) {
            alert('Product already exists');
            return;
        }
    
        if (product) {
            data.push(product);
        }
    
        const encodedData = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(data))));
        window.localStorage.setItem('data', encodedData);
        router.push('/?data=' + encodedData);
    }
}