describe('Product Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name="username"]').type('usertest')
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/client/products/1')
  })

  it('Should load the product page successfully', () => {
    cy.get('.product-main-body').should('be.visible')
  })

  it('Should increase and decrease the quantity', () => {
    cy.get('#increase-btn').click()
    cy.get('#input-value').should('have.value', '2')
    cy.get('#decrease-btn').click()
    cy.get('#input-value').should('have.value', '1')
  })

  it('Should update the total price correctly', () => {
    cy.get('#total-price').then(($totalPrice) => {
      const initialTotalPrice = $totalPrice.text()
      cy.get('#input-value').clear().type('2')
      cy.get('#total-price').click()
      cy.get('#total-price').should(($newTotalPrice) => {
        expect($newTotalPrice.text()).not.to.eq(initialTotalPrice)
      })
    })
  })

  it('Should add the product to the cart', () => {
    cy.get('#addToCart').click()
    cy.get('#cart-value-noti').should('contain', '1')
  })
})