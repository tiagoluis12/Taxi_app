import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

// Integration Test

test('Shoudl create an account for the passenger', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(200)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeDefined()
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
  const outputGetAccount = responseGetAccount.data
  // expect(outputGetAccount.name).toBe(input.name)
  // expect(outputGetAccount.email).toBe(input.email)
  // expect(outputGetAccount.cpf).toBe(input.cpf)
})

test('Should not create an account for the passenger if the name is invalid', async function () {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const responseSignup = await axios.post('http://localhost:3000/signup', input)
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup.message).toBe('Invalid name')
})
