import { Controller, Get } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('/validate')
  async validateAll() {
    return await this.brandService.validateAll();
  }

  @Get()
  async findAll() {
    return await this.brandService.findAll();
  }

  @Get('/delete')
  async deleteAll() {
    return await this.brandService.deleteAll();
  }
}
