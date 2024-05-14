import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export async function getMessageFromClassValidatorError<T extends object>(
  classToCompare: ClassConstructor<T>,
  objectToCompare: T,
  options?: ClassTransformOptions | undefined,
): Promise<string | null> {
  const errors = await validateObjectAgainstClass(classToCompare, objectToCompare, options);

  if (!errors.length) return null;

  return formatErrorMessages(errors);
}

function validateObjectAgainstClass<T extends object>(
  classToCompare: ClassConstructor<T>,
  objectToCompare: T,
  options?: ClassTransformOptions | undefined,
): Promise<ValidationError[]> {
  const dto = plainToClass(classToCompare, objectToCompare, options);
  return validate(dto);
}

function formatErrorMessages(errors: ValidationError[]) {
  return errors
    .map(({ constraints }) => {
      let message = 'An error ocurred while validating user';
      if (constraints) {
        message = Object.values(constraints).join('. ');
      }
      return message;
    })
    .join('. ');
}
