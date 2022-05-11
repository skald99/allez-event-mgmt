import { faker } from "@faker-js/faker";
import { User } from "../models/user.model";
type Address = {
    city: string
    state: string
    postal_code: string
    country: string
}


function newUser(): User {
  const name: string = faker.name.firstName() +" " + faker.name.lastName();
  const email: string = faker.internet.exampleEmail()
  let phoneStr: string = faker.phone.phoneNumberFormat()
  phoneStr = phoneStr.replace("-", "");
  phoneStr = phoneStr.replace("-", "");
  const phone: number = parseInt(phoneStr)
  const dateOfBirth: Date = faker.date.past();
  const password: string = faker.internet.password()
  const gender: string = faker.helpers.arrayElement(['M','F']);
  const city: string = faker.address.cityName();
  const state: string = faker.address.state();
  const country: string = faker.address.country();
  const postal_code: string = faker.address.zipCode();
  const hostEventArray: string[] = [];
  const attendEventArray: string[] = [];

  const address: Address = {
      city: city,
      state: state,
      postal_code: postal_code,
      country: country
  }

  let newUser: User = {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      address: address,
      hostEventArray: hostEventArray,
      attendEventArray: attendEventArray,
      dateOfBirth: dateOfBirth
  }
  return newUser;
}

export default newUser;