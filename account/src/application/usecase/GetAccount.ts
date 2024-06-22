import { AccountDAO } from '../../infra/repository/AccountDAO'

export class GetAccount {

  constructor (readonly accountDAO: AccountDAO) {

  }

  async execute (input: any): Promise <any> {
    const account = await this.accountDAO.getAccountById(input.accountId)
    return account
  }
}
