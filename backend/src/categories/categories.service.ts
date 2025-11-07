import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Category } from '@/database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }

    let category = this.categoriesRepository.create(createCategoryDto);

    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new BadRequestException('Parent category not found');
      }
      category.parent = parentCategory;
    }

    return this.categoriesRepository.save(category);
  }

  async findAll(includeChildren: boolean = false): Promise<Category[]> {
    const query = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.parent IS NULL')
      .orderBy('category.displayOrder', 'ASC')
      .addOrderBy('category.name', 'ASC');

    if (includeChildren) {
      query.leftJoinAndSelect('category.children', 'children');
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });
      if (existingCategory) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async getTree(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['children'],
      where: { parent: null },
    });
  }
}
