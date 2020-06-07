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
    getAllProducts(): any {
        let action = this.prodService.getAllProducts();
        if(action != null) {
            return action;
        } else {
            return 'No Products';
        }
    }

    @Get(':id')
    getProduct(
        @Param('id') prodId: number
    ): any {

        try
        {
            return this.prodService.getProduct(prodId);
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
    updateProduct(
        @Param('id') prodId: number, 
        @Body('title') title: string,
        @Body('description') desc: string,
        @Body('price') price: number
    ): any {
        return this.prodService.updateProduct(prodId, title, desc, price);
    }

    @Delete(':id')
    removeProduct(
        @Param('id') prodId: number
    ): any {
        let action = this.prodService.removeProduct(prodId);
        return `Successfully deleted "${action.title}" `;
    }

}

