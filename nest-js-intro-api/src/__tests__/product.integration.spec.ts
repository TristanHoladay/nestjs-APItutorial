import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products/products.module';
import { Product } from 'src/products/product.model';
import { Model } from 'mongoose';

let app: INestApplication;
let productModel: Model<Product>;

let productMock = {
    title: 'Clam Baker 2000',
    description: 'bakes clams sucka',
    price: 1000
}

beforeAll(async () => {
    const module = await Test.createTestingModule({
        imports: [
            ProductsModule,
            MongooseModule.forRoot('mongodb://localhost/test_db')
        ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    productModel = module.get('ProductModel');
});

afterAll(async () => {
    app.close();
});

describe('Product Feature', () => {

    let id: string;

    it('should create and insert a product', async() => {
        const {body} = await request.agent(app.getHttpServer())
            .post('/products')
            .send(productMock)
            .set('Accept', 'application/json')
            .expect(201);
        
        id = body._id;
        expect(body.title).toBe(productMock.title);
    });

    it('should get all products', async() => {
        const {body} = await request.agent(app.getHttpServer())
            .get('/products')
            .expect(200);
        
        expect(body[1].title).toBe(productMock.title);
    });

    it('should get a product by id', async() => {
        const {body} = await request.agent(app.getHttpServer())
            .get(`/products/${id}`)
            .expect(200);

        expect(body.id).toBe(id);
    });

    it('should update a product by id', async() => {
        let productUpdateMock = {
            title: 'Clam Shaker 3000',
        }

        const {body} = await request.agent(app.getHttpServer())
            .patch(`/products/${id}`)
            .send(productUpdateMock)
            .set('Accept', 'application/json')
            .expect(200);

        expect(body._id).toBe(id);
        expect(body.title).not.toBe(productMock.title);
    });

    it('should remove product by id', async() => {
        const {body} = await request.agent(app.getHttpServer())
            .delete(`/products/${id}`)
            .expect(200);
    });

    // it('should return "Product Not Found" when searching for id of deleted product', async() => {
    //     const {body} = await request.agent(app.getHttpServer())
    //         .get(`/products/${id}`)
    //         .expect(function(err, res) {
    //             if(err)
    //         });
        
    //     expect(body).toBe('Could not find product');
    // });

});