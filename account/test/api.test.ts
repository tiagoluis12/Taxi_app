import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

// Integration Test

test('Shoudl create an account for the passenger from API', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeDefined()
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
})

test('Should not create an account for the passenger if CPF is invalid from API', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87740',
    isPassenger: true
  }

  const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup)
  const outputSignup = responseSignup.data
  expect(responseSignup.status).toBe(422)
  expect(outputSignup.message).toBe('Invalid cpf')
})
