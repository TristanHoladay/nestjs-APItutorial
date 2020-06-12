import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from "@nestjs/common";
import { ProductService } from "./products.service";
import { Product } from "./product.model";
import { prependListener } from "cluster";

@Controller('products')
export class ProductController {
    constructor(
        private readonly prodService: ProductService
    ) {}

    @Get()
    async getAllProducts(): Promise<any> {
        let result = await this.prodService.getAllProducts();
        if(result != null) {
            return this.convertForView(result, null);
        } else {
            return 'No Products';
        }
    }

    @Get(':id')
    async getProduct(
        @Param('id') prodId: string
    ): Promise<any> {

        try
        {
            const result = await this.prodService.getProduct(prodId);
            return this.convertForView(null, result);
        }
        catch(error)
        {
            return error.message;
        }
    }

    @Post()
    addProducts(
        @Body('title') title: string, 
        @Body('description') desc: string,
        @Body('price') price: number
        ): any {
        
        let action = this.prodService.createProduct(title, desc, price);
        if(action != null) {
            return action;
        } else {
            return 'Adding product did not work';
        }
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string, 
        @Body('title') title: string,
        @Body('description') desc: string,
        @Body('price') price: number
    ): Promise<any> {
        const result = await this.prodService.updateProduct(prodId, title, desc, price);
        return result;
    }

    @Delete(':id')
    async removeProduct(
        @Param('id') prodId: string
    ): Promise<any> {
       let action = await this.prodService.removeProduct(prodId);
        return `Successfully deleted "${action.title}" `;
    }


    private convertForView(productArray?: Product[], product?: Product): any {
        if(productArray) {
            const viewProducts = productArray.map((prod) => (
                {id: prod.id, title: prod.title, description: prod.description, price: prod.price}
            ));

            return viewProducts;
        }

        if(product) {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price
            }
        }
    }

}

