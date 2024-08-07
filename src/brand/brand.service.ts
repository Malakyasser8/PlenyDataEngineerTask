import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { readData, writeBrands } from 'src/file/file.service';
import { Brand } from 'src/schemas/brand.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.modelName) private brandModel: Model<typeof Brand>,
  ) {}

  async validateBrandName(brand: any) {
    if (
      !brand.brandName ||
      brand.brandName == null ||
      brand.brandName == '' ||
      typeof brand.brandName != 'string'
    ) {
      if (brand?.brand && typeof brand.brand == 'string') {
        brand.brandName = brand.name;
      } else if (
        brand instanceof Object &&
        typeof brand.brand?.name == 'string'
      ) {
        brand.brandName = brand.brand.name;
      } else {
        brand.brandName = 'Default';
        // console.log(
        //   'Brand with id' + brand._id + 'has no brand name, set to default',
        // );
      }
    }
  }

  async validateYearFounded(brand: any) {
    if (!brand.yearFounded) {
      if (brand.yearCreated) {
        brand.yearFounded = parseInt(brand.yearCreated);
      } else if (brand.yearsFounded) {
        brand.yearFounded = parseInt(brand.yearsFounded);
      } else {
        brand.yearFounded = 1600;
        // console.log(
        //   'Brand with id' +
        //     brand._id +
        //     'has no yearFounded, set to default min 1960',
        // );
      }
    } else if (typeof brand.yearFounded != 'number') {
      const parsedYear = parseInt(brand.yearFounded, 10);
      if (
        !isNaN(parsedYear) &&
        parsedYear.toString() == brand.yearFounded.trim()
      ) {
        brand.yearFounded = parsedYear;
      } else {
        brand.yearFounded = 1600;
        // console.log(
        //   'Brand with id' +
        //     brand._id +
        //     'has no yearFounded, set to default min 1960',
        // );
      }
    } else if (
      brand.yearFounded > new Date().getFullYear() ||
      brand.yearFounded < 1600
    )
      brand.yearFounded = 1600;
  }

  async validateHeadquarter(brand: any) {
    if (
      !brand.headquarters ||
      brand.headquarters == null ||
      brand.headquarters == '' ||
      typeof brand.headquarters != 'string'
    ) {
      if (brand.hqAddress && typeof brand.hqAddress == 'string') {
        brand.headquarters = brand.hqAddress;
      } else {
        brand.brandName = 'Default';
        // console.log(
        //   'Brand with id' + brand._id + 'has no headquarter, set to default',
        // );
      }
    }
  }

  async validateNumberOfLocations(brand: any) {
    if (
      !brand.numberOfLocations ||
      brand.numberOfLocations == null ||
      brand.numberOfLocations == ''
    ) {
      brand.numberOfLocations = 1;
      // console.log(
      //   'Brand with id' +
      //     brand._id +
      //     'has no numberOfLocations, set to default min 1',
      // );
    } else if (typeof brand.numberOfLocations != 'number') {
      const parsedNumOfLocations = parseInt(brand.numberOfLocations, 10);
      if (
        !isNaN(parsedNumOfLocations) &&
        parsedNumOfLocations.toString() == brand.numberOfLocations.trim()
      ) {
        brand.numberOfLocations = parsedNumOfLocations;
      } else {
        brand.numberOfLocations = 1;
        // console.log(
        //   'Brand with id' +
        //     brand._id +
        //     'has no numberOfLocations, set to default min 1',
        // );
      }
    }
  }

  async validateOne(brand: any): Promise<typeof Brand> {
    try {
      const createdBrand = await this.brandModel.create(brand);
      return createdBrand;
    } catch (e) {
      await this.validateBrandName(brand);
      await this.validateHeadquarter(brand);
      await this.validateNumberOfLocations(brand);
      await this.validateYearFounded(brand);

      const id = brand?._id?.$oid || new mongoose.Types.ObjectId();
      const createdBrand = new this.brandModel({
        _id: id,
        brandName: brand.brandName,
        yearFounded: brand.yearFounded,
        headquarters: brand.headquarters,
        numberOfLocations: brand.numberOfLocations,
      });

      const validationError = createdBrand.validateSync();
      if (validationError) {
        console.log('Validation error for brand ', validationError);
      }

      await createdBrand.save();
      return createdBrand;
    }
  }

  async validateAll(): Promise<(typeof Brand)[]> {
    const brands = readData('old-brands.json');

    for (let brand of brands) {
      brand = await this.validateOne(brand);
    }
    return brands;
  }

  async deleteAll() {
    try {
      await this.brandModel.deleteMany();
    } catch (error) {
      console.error('Error deleting brands:', error);
    }
  }

  async findAll() {
    return await this.brandModel.find();
  }

  async seedBrands() {
    const brands = [];
    //First 5 testcases are correct
    for (let i = 0; i < 5; i++) {
      var brand = {
        brandName: faker.company.name(),
        yearFounded: faker.number.int({
          min: 1600,
          max: new Date().getFullYear(),
        }),
        headquarters: faker.location.city(),
        numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
      };
      var validatedBrand = await this.validateOne(brand);
      brands.push(validatedBrand);
    }
    //testcase 6 missing brand name
    let brand6 = {
      yearFounded: faker.number.int({
        min: 1600,
        max: new Date().getFullYear(),
      }),
      headquarters: faker.location.city(),
      numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
    };
    validatedBrand = await this.validateOne(brand6);
    brands.push(validatedBrand);

    //testcase 7 missing year founded
    let brand7 = {
      brandName: faker.company.name(),
      headquarters: faker.location.city(),
      numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
    };
    validatedBrand = await this.validateOne(brand7);
    brands.push(validatedBrand);

    //testcase 8 year is past 1600
    let brand8 = {
      brandName: faker.company.name(),
      yearFounded: faker.number.int({
        min: 1500,
        max: 1600,
      }),
      headquarters: faker.location.city(),
      numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
    };
    validatedBrand = await this.validateOne(brand8);
    brands.push(validatedBrand);

    //testcase 9 year in future
    let brand9 = {
      brandName: faker.company.name(),
      yearFounded: faker.number.int({
        min: 2025,
        max: 2030,
      }),
      headquarters: faker.location.city(),
      numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
    };
    var validatedBrand = await this.validateOne(brand9);
    brands.push(validatedBrand);

    //testcase 10 hqAddress not same name
    let brand10 = {
      brandName: faker.company.name(),
      yearFounded: faker.number.int({
        min: 2025,
        max: 2030,
      }),
      hqAddress: faker.location.city(),
      numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
    };
    var validatedBrand = await this.validateOne(brand10);
    brands.push(validatedBrand);

    try {
      await this.brandModel.insertMany(brands);
    } catch (error) {
      console.error('Error inserting brands:', error);
    }
  }

  async saveBrandsFile() {
    try {
      const brands = await this.brandModel.find();
      writeBrands(brands);
      console.log('Brand collection exported to brands.json');
    } catch (error) {
      console.error('Error exporting brands:', error);
    }
  }
}
