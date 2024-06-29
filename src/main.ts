import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BrandService } from './brand/brand.service';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const brandService = app.get(BrandService);

  console.log('Dropping all brands..');
  await brandService.deleteAll();
  console.log('Done dropping all brands.');

  console.log('Start making all brands transformations..');
  await brandService.validateAll();
  console.log('Done validating all brands.');

  console.log('Start seeding new 10 brands..');
  await brandService.seedBrands();
  console.log('Done seeding.');

  console.log('Save brands collection to new-brands.json..');
  await brandService.saveBrandsFile();
  console.log('Done Saving.');

  await app.listen(3000);
}
bootstrap();
