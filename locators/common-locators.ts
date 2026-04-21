import { Page } from "@playwright/test";
import { Locator } from "@playwright/test";
export class CommonLocators {
    page: Page;
    constructor(page:Page){
        this.page = page;
        this.locatorsInit();
    
    }

    setPage(page:Page){
        this.page = page;
    }
    getPage(){
        return this.page;
    }

    btnSummit!: Locator;

    locatorsInit(){
        this.btnSummit = this.page.locator('button[type="submit"]');
    }

}