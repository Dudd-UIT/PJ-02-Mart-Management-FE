// src/tests/e2e/specs/login.spec.ts

import LoginPage from '../pages/LoginPage';
import users from '../../fixtures/user.json'

const USERS = users

describe('Login Page Tests', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3001/login');
  });

  it('Should display Login Form', () => {
    LoginPage.getEmailInput().should('be.visible');
    LoginPage.getPasswordInput().should('be.visible');
    LoginPage.getLoginButton().should('be.visible');
    LoginPage.getRegisterLink().should('be.visible');
  });

  it('Should login with valid credentials', () => {
    LoginPage.login(USERS.validUser.email,USERS.validUser.password)
    cy.url().should('include', '/suppliers'); // Redirect successful
  });

  it('Should not login with invalid credentials', () => {
    LoginPage.login(USERS.invalidUser.email, USERS.invalidUser.password)
    LoginPage.assertErrorToast("Emai/Password không hợp lệ");
  });
});