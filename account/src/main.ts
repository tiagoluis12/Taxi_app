import AccountService, { AccountServiceProduction } from './application'
import API from './driver'
import { AccountDAODatabase } from './resource'

const AccountDAO = new AccountDAODatabase()
const accountService = new AccountServiceProduction(AccountDAO)
const api = new API(accountService)
api.build()
api.start()
