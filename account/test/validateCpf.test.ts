import { validate } from '../src/domain/vo/validateCpf'

test.each([
  '97456321558',
  '71428793860',
  '87748248800'
])
  ('Should test if a CPF is valid %s', function (cpf: string) {
    const isValid = validate(cpf)
  expect(isValid).toBe(true)
})

test.each([
  '',
  null,
  undefined,
  '123456',
  '12345678901234567890',
  '11111111111'
])
  ('Should test if a CPF is invalid %s', function (cpf: any) {
    const isValid = validate(cpf)
  expect(isValid).toBe(false)
})
