import { Product, Shop } from "@/app/types/product";

interface ProductCardProps {
    product: Product;
    deleteProduct?: (product: string) => void;
    deletable?: boolean;
    editable?: boolean;
}

export default function ProductCard( {product, deleteProduct, deletable, editable}: ProductCardProps ) {
    console.log(product);

    return(
        <div className="card card-normal sm:card-side bg-base-100 shadow-xl my-2 max-w-[90vw]">
        <figure>
            <img
            src={product.image}
            alt={product.name}
            className="w-20" />
        </figure>
        <div className="card-body flex-row">
            <div className="sm:flex-[19]">
            <p className="card-title">{product.name}</p>
            {product.shops && product.shops.map((shop: Shop) => (
                <div key={shop.name} className="flex justify-between gap-3">
                    <a href={shop.link}><p>{shop.name}</p></a>
                    <p>{shop.price}Ft</p>
                </div>
            ))}
            </div>
            <div className="sm:flex-[1] flex flex-row sm:flex-col gap-6">
                {deletable && deleteProduct && <button className="font-bold text-2xl btn btn-error" onClick={() => deleteProduct(product.name)}>X</button>}
                {editable && <button className="font-bold text-2xl btn btn-info">&#x270E;</button>}
            </div>
        </div>
        </div>
    );
}