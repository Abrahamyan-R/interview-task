export class CreateUserDto {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
}

export class GetUserDto {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
}

export class UpdateUserDto {
  first_name: string;
  last_name: string;
  username: string;
}