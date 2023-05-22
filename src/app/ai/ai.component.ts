import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import {User} from "../models/user.model";
import {UserProperty} from "../models/user-property.enum";
import { trigger, transition, style, animate, keyframes, query, stagger } from '@angular/animations';


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms 500ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AiComponent {
  delay = 300;

  public user: User | undefined;

  public userProperty = UserProperty;
  public typing: boolean = false;

  private recognition: any;

  transcript: string = '';

  constructor(
    public userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  startRecognition() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Add event handlers
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.transcript = transcript;
      console.log('Recognized speech:', transcript);
      this.changeDetectorRef.detectChanges(); // Trigger change detection
      /*this.userService.createUserProfile(transcript);*/
      // Do something with the recognized speech here
    };
    this.recognition.onerror = (event: any) => console.error('Speech recognition error:', event.error);

    // Start speech recognition
    this.recognition.start();
  }

  create() {
    if (this.transcript !== '') {
      this.userService.createUserProfile(this.transcript).subscribe((data: any) => {
        this.user = data;
        console.log(this.user);
        this.changeDetectorRef.detectChanges();
      });
    } else {
      this.user = undefined;
      this.changeDetectorRef.detectChanges();
    }
  }


  deleteTranscript() {
    this.transcript = '';
    this.typing = false;
    this.user = undefined;
    this.changeDetectorRef.detectChanges();
  }
  enableTyping() {
    this.typing = true
    this.changeDetectorRef.detectChanges();
  }
}
