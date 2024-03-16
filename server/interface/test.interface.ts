export interface TestUserDto {
  firstname: string;
  lastname: String;
  email: string;
  phone: string;
  stateOfResidence: string;
  address: string;
  password: string;
}

export interface TestUpdateDto {
  firstname: string;
  lastname: string;
  address: string;
  stateOfResidence: string;
}

export interface TestLoginDto {
  email: string;
  password: string;
}
