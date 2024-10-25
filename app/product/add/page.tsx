'use client';

import { useState } from 'react';
import ProductCard from '@/app/components/ProductCard/ProductCard';
import { Product } from '@/app/types/product';
import { useRouter } from 'next/navigation';
import ProductSearch from '@/app/components/ProductSearch/ProductSearch';

export default function AddProduct() {
    // const [shop, setShop] = useState('');
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const router = useRouter();

    return (
        <>
        <button className='btn btn-primary ml-6' onClick={router.back}>Back</button>
        <div className='p-6 m-auto md:w-3/4 lg:w-1/2 2xl:w-1/3'>
            <h1 className='font-bold p-1'>Add a product</h1>
            <ProductSearch key={"prodSearch"} product={product} setProduct={setProduct} outerLoading={setLoading}/>

            {product && product?.shops?.length < 1 && loading ? (
                <Skeleton />
            ) : (
                product && (
                <div className='flex flex-col gap-3 mt-3'>
                    <ProductCard key={product.id + product.name} product={product} deletable={false} shopEditable={true}/>
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