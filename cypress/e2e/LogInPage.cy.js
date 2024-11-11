describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('Should display login page', () => {
    cy.url().should('include', 'localhost:3000/login')
  })

  it('Should display login form', () => {
    cy.get('form').should('be.visible')
  })

  it('Should allow typing in username and password', () => {
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('password')
  })

  it('Should have a clickable login button', () => {
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click()
  })

  it('Should display error message for invalid login', () => {
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Tài khoản hoặc mật khẩu không hợp lệ').should('be.visible')
  })

  it('Should redicrect to signup page when clicking on signup link', () => {
    cy.get('a[href="/signup"]').click()
    cy.url().should('include', 'localhost:3000/signup')
  })

  it('Should not able to access client page without login', () => {
    cy.visit('http://localhost:3000/client')
    cy.url().should('include', 'localhost:3000/login')
  })

  it('Should redirect to dashboard page when login is successful', () => {
    cy.get('input[name="username"]').type('usertest')
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', 'localhost:3000/client')
  })
  
})