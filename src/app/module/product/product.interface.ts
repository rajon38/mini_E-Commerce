
export interface IProductCreatePayload {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

export interface IProductUpdatePayload {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    stock?: number;
}