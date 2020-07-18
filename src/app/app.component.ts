import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MesiboService } from './mesibo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public callStatus$ = new BehaviorSubject<any>({ caller: "N/A", status: "N/A" });
  public incomingCall$ = new BehaviorSubject<any>({});
  public connectionStatus$ = new BehaviorSubject<string>("N/A");
  public incomingCallNotify$ = new BehaviorSubject<string>("Not Coming");

  public user1Details = {
    address: "<User-Address>",
    accessToken: "<Access-Token>"
  };
  public user2Details = {
    address: "<User-Address>",
    accessToken: "<Access-Token>"
  };

  constructor(private mesiboService: MesiboService) { }

  ngOnInit() {
  }

  connectUser1() {
    this.mesiboService.init(this.user1Details.accessToken);

    this.connectionStatusHandler();
    this.callStatusHandler();
    this.incomingCallHandler();
  }

  connectUser2() {
    this.mesiboService.init(this.user2Details.accessToken);

    this.connectionStatusHandler();
    this.callStatusHandler();
    this.incomingCallHandler();
  }

  startAudioCallUser1() {
    this.mesiboService.startAudioCall("audioPlayer", this.user1Details.address);
  }

  startAudioCallUser2() {
    this.mesiboService.startAudioCall("audioPlayer", this.user2Details.address);
  }

  startVideoCallUser1() {
    this.mesiboService.startVideoCall("localVideo", "remoteVideo", this.user1Details.address);
  }

  startVideoCallUser2() {
    this.mesiboService.startVideoCall("localVideo", "remoteVideo", this.user2Details.address);
  }

  public connectionStatusHandler() {
    let tmpObj = this;

    this.mesiboService.getConnectionStatusObservable().subscribe((connectionStatus: string) => {
      if (connectionStatus) {
        tmpObj.connectionStatus$.next(connectionStatus);
      }
    });
  }

  public callStatusHandler() {
    let tmpObj = this;

    this.mesiboService.getCallStatusObservable().subscribe((callStatusDetails: any) => {
      if (callStatusDetails) {
        tmpObj.callStatus$.next(callStatusDetails);
      }
    });
  }

  public incomingCallHandler() {
    let tmpObj = this;

    this.mesiboService.getCallObservable().subscribe((incomingCallDetails: any) => {
      console.log("Call is coming.......", incomingCallDetails);
      tmpObj.incomingCallNotify$.next("Incoming Call");
      tmpObj.incomingCall$.next(incomingCallDetails);
    });
  }

  public answerCall() {
    this.mesiboService.answerCall();
  }
}
