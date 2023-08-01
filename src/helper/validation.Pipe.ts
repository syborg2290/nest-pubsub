import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const validationErrors = this.formatErrors(errors);
            throw new BadRequestException({ errors: validationErrors });
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype as any);
    }

    private formatErrors(errors: ValidationError[]) {
        return errors.map((error) => {
            for (const [key, value] of Object.entries(error.constraints)) {
                return { property: error.property, constraints: { [key]: value } };
            }
        });
    }
}
