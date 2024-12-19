//src/tests/e2e/pages/ProductTypePage.ts
class ProductTypePage {

    getInputSearch() {
        return cy.get('input[placeholder="Nhập tên loại sản phẩm"]')
      }
    
    getButtonSearch(){
        return cy.get('input[placeholder="Nhập tên loại sản phẩm"]').parent().find('button');
      }
       getCreateButton() {
            return cy.contains('button', 'Thêm');
        }
    
    getProductTypeTable(){
           return cy.get('table')
    }
      getPagination(){
          return  cy.get('.pagination');
     }
      // Create Modal
    
     openCreateModal(){
         this.getCreateButton().click();
       cy.get('.modal-dialog').should('be.visible')
        }
          
     getCreateProductTypeModal(){
         return cy.get('.modal-dialog')
     }
      getInputCreateModalByName(){
         return cy.get('.modal-dialog input[id="Tên loại sản phẩm"]', { timeout: 7000}).should('be.visible')
         
       }
    getButtonCancelCreateModal(){
      return this.getCreateProductTypeModal().contains('button', 'Thoát');
      }
      
    getButtonSaveCreateModal() {
          return   this.getCreateProductTypeModal().contains('button', 'Lưu');
        }
    // Update Modal
    openUpdateModal(productTypeName:string) {
           this.getProductTypeTable()
              .contains('td', productTypeName)
             .parent('tr')
           .find('button')
              .first()
              .click();
    
           cy.get('.modal-dialog').should('be.visible')
      }
    
       getUpdateProductTypeModal(){
           return cy.get('.modal-dialog')
           }
      
       getInputUpdateModalByName() {
             return cy.get('.modal-dialog input[id="Tên loại sản phẩm"]', { timeout: 7000 }).should('be.visible')
    
      }
     getButtonCancelUpdateModal(){
           return this.getUpdateProductTypeModal().contains('button','Thoát');
     }
         getButtonSaveUpdateModal(){
           return this.getUpdateProductTypeModal().contains('button','Lưu');
         }
      
      openDeleteModal(productTypeName:string) {
              this.getProductTypeTable()
                   .contains('td',productTypeName )
                     .parent('tr')
                   .find('button')
                 .eq(1)
                .click();
    
            cy.get('.modal-dialog').should('be.visible')
    
      }
          getDeleteModal() {
            return cy.get('.modal-dialog')
             }
       getButtonCancelDeleteModal() {
           return  this.getDeleteModal().contains('button', 'Hủy')
          }
    
          getButtonAgreeDeleteModal() {
              return  this.getDeleteModal().contains('button', 'Đồng ý');
            }
             assertToastSuccess(message:string){
                 cy.get('.Toastify__toast--success', { timeout: 5000 })
                  .should('include.text', message)
              }
         
          assertToastError(message:string){
           cy.get('.Toastify__toast--error', {timeout :5000})
                .should('include.text', message);
              }
         
    }
    export default new ProductTypePage();