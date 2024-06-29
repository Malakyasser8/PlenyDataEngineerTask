import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, brandSchema } from 'src/schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.modelName, schema: brandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
