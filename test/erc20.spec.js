/* External Imports */
const { ethers, network } = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const chaiAsPromised = require('chai-as-promised')
const { expect } = chai

chai.use(chaiAsPromised)
chai.use(solidity)

describe(`MyERC20`, () => {
  const name = 'Some Really Cool Token Name'
  const initialSupply = 10000000
  const decimals = 1
  const symbol = 'ABC'

  let account1
  let account2
  before(`load accounts`, async () => {
    ;[account1, account2] = await ethers.getSigners()
  })

  let ERC20
  beforeEach(`deploy MyERC20 contract`, async () => {
    ERC20 = await (await ethers.getContractFactory('MyERC20'))
      .connect(account1)
      .deploy(decimals, name, symbol, initialSupply)
  })

  it(`should have a name`, async () => {
    const tokenName = await ERC20.name()
    expect(tokenName).to.equal(name)
  })

  it(`should have a total supply equal to the initial supply`, async () => {
    const tokenSupply = await ERC20.totalSupply()
    expect(tokenSupply).to.equal(initialSupply)
  })

  it(`should give the initial supply to the creator's address`, async () => {
    const balance = await ERC20.balanceOf(await account1.getAddress())
    expect(balance).to.equal(initialSupply)
  })

  describe(`transfer(...)`, () => {
    it(`should revert when the sender does not have enough balance`, async () => {
      const tx = ERC20.connect(account1).transfer(
        await account2.getAddress(),
        initialSupply + 1,
        {
          gasLimit: 8999999
        }
      )

      // Temporarily necessary, should be fixed soon.
      if (network.ovm) {
        await expect(
          (await tx).wait()
        ).to.be.rejected
      } else {
        await expect(
          tx
        ).to.be.rejected
      }
    })

    it(`should succeed when the sender has enough balance`, async () => {
      const tx = await ERC20.connect(account1).transfer(
        await account2.getAddress(),
        initialSupply,
        {
          gasLimit: 8999999
        }
      )
      await tx.wait()

      expect(
        (await ERC20.balanceOf(
          await account1.getAddress()
        )).toNumber()
      ).to.equal(0)
      expect(
        (await ERC20.balanceOf(
          await account2.getAddress()
        )).toNumber()
      ).to.equal(initialSupply)
    })
  })

  describe(`transferFrom(...)`, () => {
    it(`should revert when the sender does not have enough of an allowance`, async () => {
      const tx = ERC20.connect(account2).transferFrom(
        await account1.getAddress(),
        await account2.getAddress(),
        initialSupply,
        {
          gasLimit: 8999999
        }
      )

      // Temporarily necessary, should be fixed soon.
      if (network.ovm) {
        await expect(
          (await tx).wait()
        ).to.be.rejected
      } else {
        await expect(
          tx
        ).to.be.rejected
      }
    })

    it(`should succeed when the owner has enough balance and the sender has a large enough allowance`, async () => {
      const tx1 = await ERC20.connect(account1).approve(
        await account2.getAddress(),
        initialSupply,
        {
          gasLimit: 8999999
        }
      )
      await tx1.wait()

      const tx2 = await ERC20.connect(account2).transferFrom(
        await account1.getAddress(),
        await account2.getAddress(),
        initialSupply,
        {
          gasLimit: 8999999
        }
      )
      await tx2.wait() 

      expect(
        (await ERC20.balanceOf(
          await account1.getAddress()
        )).toNumber()
      ).to.equal(0)
      expect(
        (await ERC20.balanceOf(
          await account2.getAddress()
        )).toNumber()
      ).to.equal(initialSupply)
    })
  })
})
