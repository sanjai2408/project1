import { LoggingService } from './logging.service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService){}

  ngOnInit(){
    //making sure user dsnt get logged out when refreshing
    this.authService.autoLogin();
    //injecting logging service here
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }

}
