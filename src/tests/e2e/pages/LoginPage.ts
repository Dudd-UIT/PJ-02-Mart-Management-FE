// src/tests/e2e/pages/LoginPage.ts

class LoginPage {
    getEmailInput() {
      return cy.get('input[placeholder="Nhập email"]');
    }
  
    getPasswordInput() {
      return cy.get('input[placeholder="Nhập mật khẩu"]');
    }
  
    getLoginButton() {
      return cy.contains('button', 'Đăng nhập');
    }
  
      getRegisterLink(){
          return cy.contains('a', 'Đăng ký ngay!')
      }
      
    login(email: string, password: string) {
        this.getEmailInput().type(email);
        this.getPasswordInput().type(password);
        this.getLoginButton().click();
    }
    
    assertErrorToast(message:string){
          cy.get('.Toastify__toast--error')
          .should('be.visible')
          .contains(message)
          
     }
  }
  
  export default new LoginPage();