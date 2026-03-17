// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Users } from '../src/users/entities/user.entity';
// import { Products } from '../src/products/entities/product.entity';
// import { Orders } from '../src/orders/entities/order.entity';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//   let accessToken: string;
//   let userId: string;
//   let productId: string;
//   let userRepository: Repository<Users>;
//   let productRepository: Repository<Products>;
//   let ordersRepository: Repository<Orders>;

//   const email = 'test-e2e@mail.com';
//   const password = 'Password-e2e';

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());
//     await app.init();
//     // Obtenemos el repositorio para limpiar la DB antes de empezar
//     userRepository = moduleFixture.get<Repository<Users>>(
//       getRepositoryToken(Users),
//     );
//     productRepository = moduleFixture.get<Repository<Products>>(
//       getRepositoryToken(Products),
//     );
//     ordersRepository = moduleFixture.get<Repository<Orders>>(
//       getRepositoryToken(Orders),
//     );

//     // Borramos en orden: Órdenes -> Usuarios -> Productos
//     await ordersRepository.manager.query(
//       'DELETE FROM "ORDER_DETAILS_PRODUCTS"',
//     );
//     await ordersRepository.manager.query('DELETE FROM "ORDER_DETAILS"');
//     await ordersRepository.createQueryBuilder().delete().from(Orders).execute();
//     await userRepository.delete({ email: email });
//   });

//   afterAll(async () => {
//     // Cerramos la conexión para que el test no quede "colgado"
//     await app.close();
//   });

 
//   it('POST /auth/signup - Debería crear al usuario', async () => {
//     const res = await request(app.getHttpServer())
//       .post('/auth/signup')
//       .send({
//         name: 'Usuario E2E',
//         email: email,
//         password: password,
//         confirmPassword: password,
//         address: 'Calle Falsa 123',
//         phone: 12345678,
//         country: 'Argentina',
//         city: 'Buenos Aires',
//       })
//       .expect(201);

//     const userInDb = await userRepository.findOneBy({ email });
//     const userId = userInDb?.id;

//     expect(userId).toBeDefined();
//   });

//   it('POST /auth/signin - Debería loguearse y obtener token', async () => {
//     const res = await request(app.getHttpServer())
//       .post('/auth/signin')
//       .send({ email: email, password: password })
//       .expect(201);

//     accessToken = res.body.token;
//     expect(accessToken).toBeDefined();

   
//   });

  
//   it('GET /products - Obtener lista paginada', async () => {
//     const res = await request(app.getHttpServer())
//       .get('/products?page=1&limit=5')
//       .expect(200);

//     expect(Array.isArray(res.body)).toBe(true);
//     // Si la BDD tiene productos (por el seeder), guardamos el ID del primero
//     if (res.body.length > 0) {
//       productId = res.body[0].id;
//     }
//   });

  
//   it('GET /users/:id - Debería obtener el perfil propio', async () => {
//     const userInDb = await userRepository.findOneBy({ email });
//     const userId = userInDb?.id;
//     const res = await request(app.getHttpServer())
//       .get(`/users/${userId}`)
//       .set('Authorization', `Bearer ${accessToken}`)
//       .expect(200);

//     expect(res.body.email).toBe(email);
//     expect(res.body).not.toHaveProperty('password');
//   });

  
//   it('GET /products/:id - Obtener detalle por ID', async () => {
//     if (productId) {
//       await request(app.getHttpServer())
//         .get(`/products/${productId}`)
//         .expect(200);
//     }
//   });
// });
