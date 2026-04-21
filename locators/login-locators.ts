import { Page, Locator } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class LoginLocators extends CommonLocators {
    constructor(page:Page){
        super(page);
        this.locatorsInit();
    }
    


    inputUsername!: Locator;
    inputPassword!: Locator;
    flashMessage!: Locator;

    locatorsInit(){
        super.locatorsInit();
        this.inputUsername = this.page.locator('#username');
        this.inputPassword = this.page.locator('#password');
        this.flashMessage = this.page.locator('#flash');
    }
}