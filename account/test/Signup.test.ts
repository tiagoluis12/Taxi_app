import { GetAccount } from '../src/application/usecase/GetAccount'
import { AccountDAODatabase, AccountDAOMemory } from '../src/infra/repository/AccountDAO'
import { Signup } from '../src/application/usecase/Signup'
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway'
import sinon from 'sinon'

// Integration Test or Unit Test

let signup: Signup
let getAccount: GetAccount

beforeEach(async () => {
  // Fake is a false implementation that simulate the original implementation
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountDAO, mailerGateway)
  getAccount = new GetAccount(accountDAO)
})

test('Should create a new account for the passenger', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true
  }

  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
})

test('Should not create account for the passenger with invalid name', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: true,
  }

  // await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid name'))
})

test('Should not create account for the passenger with invalid email', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '87748248800',
    isPassenger: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid email'))
})

test('Should not create account for the passenger with invalid cpf', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '8774824',
    isPassenger: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid cpf'))
})

test('Should not create an account for the passenger if the account already exists', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  }

  await signup.execute(input)
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Account already exists'))
})

test('Should not create an account for the passenger with invalid name', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA999',
    isDriver: true,
  }

  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'))
})

// Stub overrides the method, returning what you define
test('Should create account for the passenger with stub', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, 'saveAccount').resolves()
  const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountByEmail').resolves(undefined)
  const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountById').resolves(input)
  const accountDAO = new AccountDAODatabase()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway)
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  saveAccountStub.restore()
  getAccountByEmailStub.restore()
  getAccountByIdStub.restore()
})

// Spy records everything that happened with the component being spied on, then you can do whatever check you want
test('Should create account for the passenger with spy', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const sendSpy = sinon.spy(MailerGatewayMemory.prototype, 'send')
  const accountDAO = new AccountDAODatabase()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway)
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(sendSpy.calledOnce).toBe(true)
  expect(sendSpy.calledWith(input.email, 'Welcome to our platform', 'Welcome to our platform')).toBe(true)
})

// Mock mixes characteristics of Stub and Spy, creating expectations in the object itself (mock)
test('Should create account for the passenger with mock', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const sendMock = sinon.mock(MailerGatewayMemory.prototype)
  // sendMock.expects("send").withArgs(input.email, "Welcome!", "").once().callsFake(async function () {
  //   console.log("abc")
  // })

  const accountDAO = new AccountDAODatabase()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway)
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await getAccount.execute(outputSignup)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  sendMock.verify()
  sendMock.restore()
})
