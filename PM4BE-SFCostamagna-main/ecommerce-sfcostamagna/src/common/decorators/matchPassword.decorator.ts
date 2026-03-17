import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'MatchPassword',
  async: false, // no va a la base de datos
})
export class MatchPassword implements ValidatorConstraintInterface {
  // estoy diciendo que prometo tener los metodos validate y defaultMessage con la estructura que class-validator necesita
  validate(confirmPassword: string, args: ValidationArguments) {
    //traigo todo el objeto que el usuario envio
    // en el dto puse ['password'] posicion 1
    if (confirmPassword !== (args.object as any)[args.constraints[0]])
      return false;
    return true;
  }
  defaultMessage(): string {
    return `Las contraseñas no coinciden`;
  }
}
