import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Message } from './message.model';

declare var Mesibo: any;

// Connection Status Constants
declare const MESIBO_STATUS_ONLINE, MESIBO_STATUS_CONNECTING, MESIBO_STATUS_CONNECTFAILURE, MESIBO_STATUS_SIGNOUT, MESIBO_STATUS_AUTHFAIL;

// Message Status Constants
declare const MESIBO_FLAG_DELIVERYRECEIPT, MESIBO_FLAG_READRECEIPT;

// Call Status Constants
declare const MESIBO_CALLSTATUS_COMPLETE, MESIBO_CALLSTATUS_RINGING, MESIBO_CALLSTATUS_ANSWER, MESIBO_CALLSTATUS_BUSY, MESIBO_CALLSTATUS_NOANSWER, MESIBO_CALLSTATUS_INVALIDDEST, MESIBO_CALLSTATUS_UNREACHABLE, MESIBO_CALLSTATUS_OFFLINE;


@Injectable({
  providedIn: 'root'
})
export class MesiboService {

  private apiObj: any;
  private appId = "<App-ID>";
  private services = {

  };

  /*Observable Declaration For Messages: Start */
  private messageObservable: Observable<Message>;
  private connectionStatusObservable: Observable<string>;
  private messageStatusObservable: Observable<string>;
  /*Observable Declaration For Messages: End */

  /*Observable Declaration For Call: Start */
  private callObservable: Observable<any>;
  private callStatusObservable: Observable<any>;
  /*Observable Declaration For Call: End */
  

  constructor() {
  }

  //To initilize Mesibo using User's Access Token
  init(userAccessToken: string) {
    this.initListeners();
    this.apiObj = new Mesibo();
    this.apiObj.setAppName(this.appId);
    this.apiObj.setListener(new this.mesiboListener());
    this.apiObj.setCredentials(userAccessToken);
    this.apiObj.start();
  }

  private mesiboListener() {
  }

  //Setting All the Listeners
  private initListeners() {

    /* Connection Status Listener: Triggers each time Connection state change: Start */
    this.connectionStatusObservable = new Observable((subscriber: Subscriber<string>) => {
      let statusStr;
      this.mesiboListener.prototype.Mesibo_OnConnectionStatus = function (status, value) {
        console.log("TestNotify.prototype.Mesibo_OnConnectionStatus: ", status, value);

        switch (status) {
          case MESIBO_STATUS_ONLINE:
            statusStr = "Online";
            break;
          case MESIBO_STATUS_CONNECTFAILURE:
            statusStr = "Connection Failed";
            break;
          case MESIBO_STATUS_SIGNOUT:
            statusStr = "Signed out";
            break;
          case MESIBO_STATUS_AUTHFAIL:
            statusStr = "Authentication Failed: Bad Token or App ID";
            break;
          default:
            statusStr = "You are offline";
        }

        subscriber.next(statusStr);
      }
    });
    /* Connection Status Listener: Triggers each time Connection state change: End */

    /* Message Status Listener: Triggers each time Sent Message Status change: Start */
    this.messageStatusObservable = new Observable((subscriber: Subscriber<string>) => {
      let statusStr;
      this.mesiboListener.prototype.Mesibo_OnMessageStatus = function (m) {
        console.log("TestNotify.prototype.Mesibo_OnMessageStatus: from ", m);

        switch (m.status) {
          case MESIBO_FLAG_DELIVERYRECEIPT:
            statusStr = "Sent";
            break;
          case MESIBO_FLAG_READRECEIPT:
            statusStr = "Delivered";
            break;
          default:
            statusStr = "Unknown: " + status;
        }

        subscriber.next(statusStr);

      }
    });
    /* Message Status Listener: Triggers each time Sent Message Status change: End */

    /* Message Listener: Triggers each time New Message Received : Start */
    this.messageObservable = new Observable((subscriber: Subscriber<Message>) => {
      this.mesiboListener.prototype.Mesibo_OnMessage = function (m, data) {
        console.log("TestNotify.prototype.Mesibo_OnMessage: from ", m, data);
        subscriber.next({
          from: m.peer,
          message: data
        });
      }
    });
    /* Message Listener: Triggers each time New Message Received : End */

    /* Call Status Listener: Triggers each time Initiated Call State Changes : Start */
    this.callStatusObservable = new Observable((subscriber: Subscriber<any>) => {
      let statusStr;
      this.mesiboListener.prototype.Mesibo_OnCallStatus = function (callId, status) {
        console.log("TestNotify.prototype.Mesibo_OnCallStatus: from ", callId, status);

        switch (status) {
          case MESIBO_CALLSTATUS_COMPLETE:
            statusStr = "Completed";
            break;
          case MESIBO_CALLSTATUS_RINGING:
            statusStr = "Ringing";
            break;
          case MESIBO_CALLSTATUS_ANSWER:
            statusStr = "Answered";
            break;
          case MESIBO_CALLSTATUS_BUSY:
            statusStr = "Busy";
            break;
          case MESIBO_CALLSTATUS_NOANSWER:
            statusStr = "No Answer";
            break;
          case MESIBO_CALLSTATUS_INVALIDDEST:
            statusStr = "Invalid Destination";
            break;
          case MESIBO_CALLSTATUS_UNREACHABLE:
            statusStr = "Unreachable";
            break;
          case MESIBO_CALLSTATUS_OFFLINE:
            statusStr = "Offline";
            break;
          default:
            statusStr = "Unknown: " + status;
        }

        subscriber.next({
          caller : callId,
          status : statusStr
        });
      }
    });
    /* Call Status Listener: Triggers each time Initiated Call State Changes : End */

    /* Call Listener: Triggers each time New Call Request Received : Start */
    let tmpObj = this;
    this.callObservable = new Observable((subscriber: Subscriber<any>) => {
      this.mesiboListener.prototype.Mesibo_OnCall = function (callId, from, video) {
        console.log("TestNotify.prototype.Mesibo_OnCall: from ", callId, from, video);
        if(video) {
          tmpObj.apiObj.setupVideoCall("localVideo", "remoteVideo", true);
        } else {
          tmpObj.apiObj.setupVoiceCall("audioPlayer");
        }
        subscriber.next({
          callId: callId,
          caller: from,
          isVideoCall: video ? true:false
        });
      }
    });
    /* Call Listener: Triggers each time New Call Request Received : End */
  }

  /**
   * @description Send the Message
   * @param to User's Address to whom we want to send the message
   * @param message Message connect that we want send
   */
  public sendMessage(to, message) {
    let p: any = {};
    if (to && message) {
      p.peer = to;
      let id = Math.trunc(Math.random() * 10000);
      return this.apiObj.sendMessage(p, id, message);
    }
    return false;
  }

  /* To Get Message Observable to do Something on new Message receive */
  public getMessageObservable(): Observable<Message> {
    return this.messageObservable;
  }
  
  /* To Get Message Status Observable to do Something on Message Status Change */
  public getMessageStatusObservable(): Observable<string> {
    return this.messageStatusObservable;
  }
  
  /* To Get Connection Status Observable to do Something on Connection Status Change */
  public getConnectionStatusObservable(): Observable<string> {
    return this.connectionStatusObservable;
  }
  
  /* To Get Call Status Observable to do Something on Call Status Change */
  public getCallStatusObservable(): Observable<any> {
    return this.callStatusObservable;
  }
  
  /* To Get Call Observable to do Something on new Call Request received */
  public getCallObservable(): Observable<any> {
    return this.callObservable;
  }

  /* To Answer a requested Call */
  public answerCall() {
    console.log("Call Answered");
    this.apiObj.answer(true);
  }

  /* To Hangup the current Call */
  public hangupCall() {
    console.log("Hang up Call");
    this.apiObj.hangup();
  }

  /**
   * @description Start a Video call
   * @param localVideoEleId Video Element ID where local Cam video will be available
   * @param remoteVideoEleId Video Element ID where Remote Cam Video will be available
   * @param receiverAddrId Receiver Add ID which we have provided while create the user
   */
  public startVideoCall(localVideoEleId, remoteVideoEleId, receiverAddrId) {
    if (this.apiObj && localVideoEleId && remoteVideoEleId ) {
      this.apiObj.setupVideoCall(localVideoEleId, remoteVideoEleId, true);
      this.apiObj.call(receiverAddrId);
    }
  }

  /**
   * @description Start a Audio call
   * @param audioPlayerEleId Audio Player Element ID
   * @param receiverAddrId Receiver Addr ID which we have provided while create the user
   */
  public startAudioCall(audioPlayerEleId, receiverAddrId) {
    if ( this.apiObj && audioPlayerEleId ) {
      this.apiObj.setupVoiceCall(audioPlayerEleId);
      this.apiObj.call(receiverAddrId);
    }
  }
}
