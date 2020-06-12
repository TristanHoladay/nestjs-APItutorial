import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductService {
  products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    if (products.length > 0) {
      return products;
    }

    return null;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.findProduct(id);
    if (!product) {
      throw new Error('Cannot find product by that id');
    } else {
      return product;
    }
  }

  async createProduct(
    title: string,
    desc: string,
    price: number,
  ): Promise<Product> {
    if (!title || !desc || !price) {
      return null;
    }

    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price,
    });
    const insertion = await this.insertProduct(newProduct);
    if (insertion != null) {
      return newProduct;
    } else {
      //throw new Error('product was not saved to the DB');
      return null;
    }
  }

  async insertProduct(product: any): Promise<Product> {
    if (product != null) {
      await product.save();
      return product;
    } else {
      return null;
    }
  }

  async updateProduct(
    prodId: string,
    title: string,
    desc: string,
    price: number,
  ): Promise<Product> {
    const updatedProd = await this.findProduct(prodId);
    if (title) {
      updatedProd.title = title;
    }
    if (desc) {
      updatedProd.description = desc;
    }
    if (price) {
      updatedProd.price = price;
    }

    updatedProd.save();
    return updatedProd;
  }

  async removeProduct(prodId: string): Promise<Product> {
    const product = await this.findProduct(prodId);
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (result.n > 0) {
      return product;
    } else {
      throw new NotFoundException (
        `Could not delete the product: ${product.title}`,
      );
    }
  }

  private async findProduct(prodId: string): Promise<Product> {
    const product = await this.productModel.findById(prodId);
    if (!product) {
      throw new NotFoundException('Could not find product');
    }

    return product;
  }
}
