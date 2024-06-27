import MailerGateway from '../src/MailerGateway'
import AccountService, {AccountServiceProduction } from '../src/application'
import { AccountDAODatabase, AccountDAOMemory } from '../src/resource'
import sinon from 'sinon'

// Integration Test or Unit Test

let accountService: AccountService

beforeEach(async () => {
  // Fake is a false implementation that simulate the original implementation
  const accountDAO = new AccountDAODatabase()
  accountService = new AccountServiceProduction(accountDAO)
})

test('Should create a new account for the passenger', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
  }

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
})

test('Should not create a driver account', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: false,
  }

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  expect(outputGetAccount.carPlate).toBe(inputSignup.carPlate)
})

test('Should not create account for the passenger with invalid name', async function () {
  const input = {
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA9999',
    isPassenger: true,
  }

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error('Invalid name'))
})

test('Should not create account for the passenger with invalid email', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '87748248800',
    isPassenger: true,
  }

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error('Invalid email'))
})

test('Should not create account for the passenger with invalid cpf', async function () {
  accountService = new AccountServiceProduction(new AccountDAOMemory())
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '8774824',
    isPassenger: true,
  }

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error('Invalid cpf'))
})

test('Should not create an account for the passenger if the account already exists', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true,
  }

  await accountService.signup(input)
  await expect(() => accountService.signup(input)).rejects.toThrow(new Error('Account already exists'))
})

test('Should not create a driver account with an invalid license plate', async function () {
  accountService = new AccountServiceProduction(new AccountDAOMemory())
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    carPlate: 'AAA999',
    isDriver: true,
  }

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error('Invalid car plate'))
})

// Stub overrides the method, returning what you define
test('Should create account for the passenger with stub from MailerGateway', async function () {
  const stub = sinon.stub(MailerGateway.prototype, 'send').resolves()
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  stub.restore()
})

test('Should create account for the passenger with stub from AccountDAO', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const stubSaveAccount = sinon.stub(AccountDAODatabase.prototype, 'saveAccount').resolves()
  const stubGetAccountByEmail = sinon.stub(AccountDAODatabase.prototype, 'getAccountByEmail').resolves(undefined)
  const stubGetAccountById = sinon.stub(AccountDAODatabase.prototype, 'getAccountById').resolves(inputSignup)
  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  stubSaveAccount.restore()
  stubGetAccountByEmail.restore()
  stubGetAccountById.restore()
})

test('Should create account for the passenger with fake from AccountDAO', async function () {
  accountService = new AccountServiceProduction(new AccountDAOMemory())
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
})

// Spy records everything that happened with the component being spied on, then you can do whatever check you want
test('Should create account for the passenger with spy from MailerGateway', async function () {
  const spySend = sinon.spy(MailerGateway.prototype, 'send')
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  expect(spySend.calledOnce).toBe(true)
  expect(spySend.calledWith(inputSignup.email, 'Welcome to our platform', 'Welcome to our platform')).toBe(true)
  spySend.restore()
})

// Mock mixes characteristics of Stub and Spy, creating expectations in the object itself (mock)
test('Should create account for the passenger with mock from MailerGateway', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  }

  const mockMailerGateway = sinon.mock(MailerGateway.prototype)
  mockMailerGateway.expects("send").withArgs(inputSignup.email, "Welcome!", "").once().callsFake(() => {
    console.log("abc")
  })

  const outputSignup = await accountService.signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
  const outputGetAccount = await accountService.getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  mockMailerGateway.verify()
  mockMailerGateway.restore()
})
