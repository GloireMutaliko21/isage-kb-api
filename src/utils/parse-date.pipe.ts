import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string | number, metadata: ArgumentMetadata) {
    const date = this.convertTimestamp(value);
    if (!date || isNaN(+date)) throw new BadRequestException('Invalid date');
    return date;
  }

  private convertTimestamp(timestamp: string | number) {
    const isSecond =
      typeof timestamp == 'number' &&
      !(timestamp > (Date.now() + 24 * 60 * 60 * 1000) / 1000);
    return isSecond
      ? new Date(typeof timestamp == 'number' && timestamp * 1000)
      : new Date(timestamp);
  }
}
