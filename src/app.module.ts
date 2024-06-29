import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://malakyasser8:Bv16quwro3Bp7UrO@cluster0.yejdxco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        dbName: 'RestaurantBrands',
      },
    ),
    BrandModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
