describe('Client Page Tests', () => {
  beforeEach(() => {
    //Login 
    cy.visit('http://localhost:3000/login')
    cy.get('input[name="username"]').type('usertest')
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/client')
  })

  it('Should load the client page successfully', () => {
    cy.get('.main-body').should('be.visible')
  })

  it('Should display categories and allow selection', () => {
    cy.get('input[name="categories"]').should('have.length.greaterThan', 0)
    cy.get('input[name="categories"]').first().check()
    cy.get('input[name="categories"]').first().should('be.checked')
  })

  it('Should display products when a category is selected', () => {
    cy.get('input[name="categories"]').first().check()
    cy.get('#card-container').children().should('have.length.greaterThan', 0)
  })

  it('Should navigate to the next page using pagination', () => {
    cy.get('#next-page').click()
    cy.get('#pagination').children().first().should('not.have.class', 'page-active')
  })

  it('Should navigate to the previous page using pagination', () => {
    cy.get('#next-page').click()
    cy.get('#previous-page').click()
    cy.get('#pagination').children().first().should('have.class', 'page-active')
  })

  it('Should search for products', () => {
    cy.get('#searchInput').type('Đồng Hồ Nữ')
    cy.get('#searchButton').click()
    cy.get('#card-container').children().should('have.length.greaterThan', 0)
  })
})