import { Injectable } from "@angular/core";

//not important for this application but is used to understand the different service instance of things
//@Injectable({providedIn: 'root'})
export class LoggingService{
    lastlog: string;

    printLog(message: string){
        console.log(message);
        console.log(this.lastlog);
        this.lastlog = message;
    }
}