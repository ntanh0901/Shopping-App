describe('Cart Page Tests', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('input[name="username"]').type('usertest')
      cy.get('input[name="password"]').type('123')
      cy.get('button[type="submit"]').click()
      cy.visit('http://localhost:3000/client/products/1')
      cy.get('#addToCart').click()
      cy.visit('http://localhost:3000/client/products/2')
      cy.get('#addToCart').click()
      cy.visit('http://localhost:3000/client/cart')
      //add product to cart
      
  })

  it('Should load the cart page successfully', () => {
      cy.get('.cart-body').should('be.visible')
  })

  it('Should increase and decrease the quantity', () => {
      cy.get('.increase-btn').first().click()
      cy.get('.product-amount input').first().should('have.value', '2')
      cy.get('.decrease-btn').first().click()
      cy.get('.product-amount input').first().should('have.value', '1')
  })

  it('Should update the total price correctly when quantities are changed', () => {
      cy.get('.total-value').first().then(($total) => {
          const initialTotal = $total.text()
          cy.get('.increase-btn').first().click()
          cy.get('.total-value').first().should(($newTotal) => {
              expect($newTotal.text()).not.to.eq(initialTotal)
          })
      })
  })

  it('Should select all products when "Select All" checkbox is clicked', () => {
      cy.get('#checkAll').click()
      cy.get('.check-cart').each(($checkbox) => {
          expect($checkbox).to.be.checked
      })
  })

  it('Should update the total price correctly when products are selected', () => {
      cy.get('.check-cart').first().click()
      cy.get('#total-price').then(($totalPrice) => {
          const initialTotalPrice = $totalPrice.text()
          cy.get('.check-cart').first().click()
          cy.get('#total-price').should(($newTotalPrice) => {
              expect($newTotalPrice.text()).not.to.eq(initialTotalPrice)
          })
      })
  })
})