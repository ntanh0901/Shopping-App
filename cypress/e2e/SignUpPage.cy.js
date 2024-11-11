describe('SignUp Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup')
  })

  it('Should display signup page', () => {
    cy.url().should('include', 'localhost:3000/signup')
  })

  it('Should display signup form', () => {
    cy.get('form').should('be.visible')
  })

  it('Should redirect to login page when clicking on login link', () => {
    cy.get('a[href="/login"]').click()
    cy.url().should('include', 'localhost:3000/login')
  })

  it('Should allow typing in user information', () => {
    cy.get('input[name="fullname"]').type('Test User')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password')
    cy.get('input[name="confirmpassword"]').type('password')
    cy.get('input[name="birth"]').type('2000-01-01')
    cy.get('input[name="gender"][value="Nam"]').check()
    cy.get('input[name="phone"]').type('0123456789')
  })

  it('Should display error when username is already taken', () => {
    cy.get('input[name="fullname"]').type('Test User')
    cy.get('input[name="username"]').type('usertest')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password')
    cy.get('input[name="confirmpassword"]').type('password')
    cy.get('input[name="birth"]').type('2000-01-01')
    cy.get('input[name="gender"][value="Nam"]').check()
    cy.get('input[name="phone"]').type('0123456789')
    cy.get('button[type="submit"]').click()
    cy.contains('Tên đăng nhập đã tồn tại').should('be.visible')
  })

  //it('Should redirect to client page when signup is successful', () => {
  //   cy.get('input[name="fullname"]').type('Test User')
  //   cy.get('input[name="username"]').type('usertest8')
  //   cy.get('input[name="email"]').type('test@example.com')
  //   cy.get('input[name="password"]').type('123456')
  //   cy.get('input[name="confirmpassword"]').type('123456')
  //   cy.get('input[name="birth"]').type('2000-01-01')
  //   cy.get('input[name="gender"][value="Nam"]').check()
  //   cy.get('input[name="phone"]').type('0123456789')
  //   cy.get('button[type="submit"]').click()
  //   cy.url().should('include', 'localhost:3000/client')
  // })

})