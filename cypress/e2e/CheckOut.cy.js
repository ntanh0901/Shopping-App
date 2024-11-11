describe('Checkout Page Tests', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('input[name="username"]').type('usertest')
      cy.get('input[name="password"]').type('123')
      cy.get('button[type="submit"]').click()
      cy.visit('http://localhost:3000/client/products/1')
      cy.get('#addToCart').click()
      cy.visit('http://localhost:3000/client/cart')
      cy.get('.check-cart').first().click()
      cy.get('#checkout').click()
  })

  it('Should load the checkout page successfully', () => {
      cy.get('.checkout-body').should('be.visible')
  })

  it('Should display order information correctly', () => {
      cy.get('.grid-container').should('have.length.greaterThan', 0)
      cy.get('.grid-container').first().should('contain', 'Số lượng')
  })

  it('Should display payment method and balance correctly', () => {
      cy.get('.bx-wallet').should('be.visible')
      cy.get('.bx-money').should('be.visible')
      cy.get('.text-danger').should('contain', 'Số dư hiện tại')
  })

  it('Should enable "Thanh toán" button when the user can afford the order', () => {
      cy.get('body').then(($body) => {
          if ($body.find('form[action="/client/checkoutSuccess"]').length > 0) {
              cy.get('form[action="/client/checkoutSuccess"] button').should('be.enabled')
          }
      })
  })

  it('Should display "Nạp tiền" button when the user cannot afford the order', () => {
      cy.get('body').then(($body) => {
          if ($body.find('form[action="/client/wallet"]').length > 0) {
              cy.get('form[action="/client/wallet"] button').should('contain', 'Nạp tiền')
          }
      })
  })
})