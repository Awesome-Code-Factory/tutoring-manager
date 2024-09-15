import { CommonError } from "./common";

export class WrongInput<
  TFields extends Record<string, string[]>,
> extends CommonError {
  override code: 400;
  constructor(public fields: TFields) {
    super(JSON.stringify(fields), 400);
    this.code = 400;
    this.name = "Wrong user input";
  }
}
