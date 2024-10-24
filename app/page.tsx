'use client'    
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from './components/ProductCard/ProductCard';
import { Product } from './types/product';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const localData = window.localStorage.getItem('data');
        if (localData) {
            router.push(`?data=${localData}`);
        }
    }, [router]);

    const searchParams = useSearchParams();
    const data = searchParams.get("data");
    let usableData: Product[] = [];
    const decodeData = (encodedData: string) => {
        const jsonString = atob(encodedData);
        return JSON.parse(jsonString);
    };

    if (data) {
        usableData = decodeData(data);
    }

    return (
        <div className="flex items-center flex-col gap-3 max-w-[100vw]">
            <div className='flex flex-col-reverse sm:flex-col items-center'>
                <div>
                {usableData ? (
                    <div>
                        <ul>
                            {usableData.map((product: Product) => (
                                <ProductCard key={product.name} product={product} deleteProduct={deleteProduct} deletable={true} editable={true} />
                            ))}
                        </ul>
                    </div>
                ): (
                <div>
                    <p>No items to display</p>
                </div>
                )}
                </div>
                <div>
                <Link href={'/product/add'} className='btn bg-green-700 w-16 text-xl my-6'>+</Link>
                </div>
            </div>
        </div>
    );

    function deleteProduct(productName: string) {
        usableData = usableData.filter((product: Product) => product.name !== productName);
        const encodedData = btoa(JSON.stringify(usableData));
        window.localStorage.setItem('data', encodedData);
        router.push(`?data=${encodedData}`);
    }
}