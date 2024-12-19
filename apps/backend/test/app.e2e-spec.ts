// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//
//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//
//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   }); });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../src/modules/app/app.module';
import { User, UserSchema, Ensemble, EnsembleSchema } from '../src/schemas';
import { Connection, Model, Models } from 'mongoose';

describe('API Integration Tests', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let httpServer: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Ensemble.name, schema: EnsembleSchema },
        ]),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('Users', () => {
    let userId: string;
    const createUserDto = {
      email: 'test@example.com',
      password: 'securePass123',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      bio: 'Professional musician',
      instruments: ['piano', 'guitar'],
      genres: ['jazz', 'classical'],
    };

    it('should create a user', () => {
      return request(httpServer)
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect(({ body }) => {
          userId = body.id;
          expect(body.email).toBe(createUserDto.email);
          expect(body.instruments).toHaveLength(2);
          expect(body).not.toHaveProperty('password');
        });
    });

    it('should get a user', () => {
      return request(httpServer)
        .get(`/users/${userId}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.firstName).toBe(createUserDto.firstName);
          expect(body.genres).toContain('jazz');
        });
    });

    it('should validate request body', () => {
      return request(httpServer)
        .post('/users')
        .send({
          email: 'invalid',
          age: 'not-a-number',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeInstanceOf(Array);
        });
    });

    it('should handle multipart/form-data', () => {
      return request(httpServer)
        .post('/users')
        .field('email', 'multipart@test.com')
        .field('firstName', 'Jane')
        .field('lastName', 'Doe')
        .field('age', '28')
        .field('instruments[]', 'violin')
        .field('genres[]', 'classical')
        .attach('avatar', 'test/fixtures/avatar.jpg')
        .expect(201)
        .expect(({ body }) => {
          expect(body.email).toBe('multipart@test.com');
          expect(body.avatarUrl).toBeDefined();
        });
    });
  });

  describe('Ensembles', () => {
    let ensembleId: string;
    let userId: string;

    beforeEach(async () => {
      const response = await request(httpServer)
        .post('/users')
        .send({
          email: 'member@example.com',
          password: 'pass123',
          firstName: 'Test',
          lastName: 'User',
          age: 30,
          instruments: ['piano'],
          genres: ['jazz'],
        });
      userId = response.body.id;
    });

    it('should create an ensemble', () => {
      return request(httpServer)
        .post('/ensembles')
        .send({
          name: 'Jazz Quartet',
          createdBy: userId,
          members: [userId],
          genres: ['jazz', 'fusion'],
        })
        .expect(201)
        .expect(({ body }) => {
          ensembleId = body.id;
          expect(body.name).toBe('Jazz Quartet');
          expect(body.members).toHaveLength(1);
        });
    });

    it('should handle bulk member updates', () => {
      return request(httpServer)
        .put(`/ensembles/${ensembleId}/members`)
        .send({
          members: [userId, 'another-user-id'],
          operation: 'add',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.members).toHaveLength(2);
        });
    });

    it('should delete an ensemble', async () => {
      return request(httpServer)
        .delete(`/ensembles/${ensembleId}`)
        .expect(204)
        .then(() =>
          request(httpServer).get(`/ensembles/${ensembleId}`).expect(404),
        );
    });
  });
});

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let httpServer: any;
  let user_db: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          // { name: Ensemble.name, schema: EnsembleSchema },
        ]),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    user_db = moduleRef.get(User.name);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await mongod.stop();
    await app.close();
  });

  afterEach(async () => {
    await user_db.deleteMany({});
  });

  describe('/auth', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe('testuser');
        });
    });

    it('should login and return JWT token', async () => {
      // First register a user
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'testuser',
        password: 'password123',
      });

      // Then try to login
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'wronguser',
          password: 'wrongpass',
        })
        .expect(401);
    });

    it('should access protected route with valid token', async () => {
      // Register and login to get token
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'testuser',
        password: 'password123',
      });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      const token = loginRes.body.access_token;

      // Test protected route
      return request(app.getHttpServer())
        .get('/healthcheck/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should reject protected route without token', () => {
      return request(app.getHttpServer())
        .get('/healthcheck/protected')
        .expect(401);
    });
  });
});
