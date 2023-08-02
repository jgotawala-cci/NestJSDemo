import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approve: boolean) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not Found!!');
    }
    report.approved = approve;
    return this.repo.save(report);
  }

  async createEstimate({
    maker,
    model,
    mileage,
    year,
    lat,
    long,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('ROUND(AVG(price))', 'price')
      .where('maker= :maker', { maker })
      .andWhere('model= :model', { model })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('long - :long BETWEEN -5 AND 5', { long })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage -:mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
