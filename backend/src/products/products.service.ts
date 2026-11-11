import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  // CRUD
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        stock: createProductDto.stock ?? 0,
        is_active: createProductDto.is_active ?? true,
      });
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`, error.stack);
      throw new InternalServerErrorException('No se pudo crear el producto');
    }
  }


  async findAll(query?: QueryProductDto): Promise<Product[]> {
    const qb = this.productRepository.createQueryBuilder('product');

    if (query?.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere('LOWER(product.name) LIKE :term', { term });
    }

    if (query?.category) {
      qb.andWhere('LOWER(product.category) = LOWER(:category)', {
        category: query.category.trim(),
      });
    }

    if (query?.isActive !== undefined) {
      qb.andWhere('product.is_active = :isActive', { isActive: query.isActive });
    }

    return await qb.orderBy('product.id', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    try {
      const merged = this.productRepository.merge(product, updateProductDto);
      return await this.productRepository.save(merged);
    } catch (error) {
      this.logger.error(`Error al actualizar producto ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('No se pudo actualizar el producto');
    }
  }

  async remove(id: number): Promise<{ message: string; deletedId: number }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return {
      message: `Producto "${product.name}" con ID ${id} eliminado correctamente`,
      deletedId: id,
    };
  }

  async getCategories(): Promise<string[]> {
    const rows = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .orderBy('product.category', 'ASC')
      .getRawMany();
    return rows.map((r) => r.category);
  }

  async getStats() {
    const products = await this.productRepository.find();
    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
      totalStock: products.reduce((acc, p) => acc + (p.stock || 0), 0),
      totalInventoryValue: Number(
        products.reduce((acc, p) => acc + Number(p.price) * (p.stock || 0), 0).toFixed(2),
      ),
    };
  }
}
