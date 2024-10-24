// Ensure the Shop interface or type is defined
export interface Shop {
    name: string;
    price: number;
    link: string;
}

// Define and export the Product interface
export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    shops: Shop[];
    lastFetch: Date;
}