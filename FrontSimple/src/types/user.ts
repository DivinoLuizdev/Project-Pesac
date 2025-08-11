export interface User {
  id: string;
  gender: "male" | "female";
  title: string;
  firstName: string;
  lastName: string;
  streetNumber: number;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: string;
  longitude: string;
  timezoneOffset: string;
  timezoneDescription: string;
  email: string;
  loginUuid?: string;
  username: string;
  password?: string;
  salt?: string;
  md5?: string;
  sha1?: string;
  sha256?: string;
  dobDate: string;
  dobAge: number;
  registeredDate?: string;
  registeredAge?: number;
  phone: string;
  cell: string;
  idName: string;
  idValue: string;
  pictureLarge?: string;
  pictureMedium?: string;
  pictureThumbnail: string;
  nationality: string;
}

export interface UsersResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalUsers: number;
  users: User[];
}

export interface CreateUserData extends Omit<User, 'id' | 'dobAge' | 'registeredAge'> {
  id?: string;
  dobAge?: number;
  registeredAge?: number;
}