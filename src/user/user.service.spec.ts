import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: User.name,
//           useValue: {},
//         }
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
