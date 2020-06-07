import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from './product.model';

@Injectable()
export class ProductService {
    products: Product[] = [];
    id: number = 0; 

    getAllProducts(): Product[] {
        if(this.products.length > 0) {
            return [...this.products];
        }
        
        return null; 
    }

    getProduct(id: number): Product {
       const product = this.products.find((prod) => prod.id == id);
        if(!product) {
            throw new Error('Cannot find product by that id');
        } else {
            return { ...product };
        }
    }

    createProduct(title: string, desc: string, price: number): Product {
        this.id++;
        if(!title || !desc|| !price) {
            return null;
        }

        const newProduct = new Product(this.id, title, desc, price);
        if(this.insertProduct(newProduct) != null) {
            return newProduct;
        } else {
            //throw new Error('product was not saved to the DB');
            return null;
        }
    }

    insertProduct(product: Product): Product {
        if(product != null) {
            this.products.push(product);
            return product;
        } else {
            return null; 
        }
    }

    updateProduct(prodId: number, title: string, desc: string, price: number): Product {
        const [currentProd, index] = this.findProduct(prodId);
        const updatedProd = { ...currentProd, } 
        if(title) {
            updatedProd.title = title;
        }
        if(desc) {
            updatedProd.description = desc;
        }
        if(price) {
            updatedProd.price = price;
        }

        this.products[index] = updatedProd;
        return updatedProd;
    }

    removeProduct(prodId: number): Product {
        const [product, index] = this.findProduct(prodId);
        this.products.splice(index, 1);
        return product;
    }

    private findProduct(prodId: number): [Product, number] {
        const productIndex = this.products.findIndex((prod) => prod.id == prodId);
        const product = this.products[productIndex];
        if(!product) {
            throw new NotFoundException('Could not find product to update');
        }

        return [product, productIndex];
    }
}