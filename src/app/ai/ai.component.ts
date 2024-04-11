import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { PersonService } from "../service/person.service";
import { Person } from "../models/person.model";
import { PersonProperty } from "../models/person-property.enum";
import { Subscription } from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { WaveFile } from 'wavefile';
import * as fs from 'fs';
import {FormControl, FormGroup, Validators} from "@angular/forms";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent implements OnDestroy {

  public email: string = "";
  emailForm!: FormGroup;
  public newProfile!: Person;
  public hasNew: boolean = false;
  public existingProfile!: Person;
  public hasExisting: boolean = false;
  public userProperty = PersonProperty;
  public typing: boolean = false;
  private recognition: any;
  private subscription!: Subscription;
  public transcript: string = '';

  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];
  public recording: boolean = false;
  public recordedAudio: Blob | undefined;
  public audioUrl: string | undefined;
  downloadUrl: string | undefined;



  constructor(
    public userService: PersonService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)])
    });
  }

  submitEmail() {
    if (this.emailForm.valid) {
      this.email = this.emailForm.get('email')?.value;
      this.changeDetectorRef.detectChanges(); // Trigger change detection
    }
  }

  startRecognition() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.transcript = transcript;
      console.log('Recognized speech:', transcript);
      this.changeDetectorRef.detectChanges(); // Trigger change detection
      // Do something with the recognized speech here
    };

    this.recognition.onspeechend = () => {
      this.recognition.stop();
      this.recognition = null;
      this.changeDetectorRef.detectChanges();
    };

    this.recognition.onnomatch = () => {
      this.recognition.stop();
      this.recognition = null;
      this.changeDetectorRef.detectChanges();
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.recognition.stop();
      this.recognition = null;
      this.changeDetectorRef.detectChanges();
    };

    this.recognition.start();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  deleteRecording() {
    this.recordedAudio = undefined;
    this.transcript = ""
    this.hasNew = false;
    this.hasExisting = false;
    this.changeDetectorRef.detectChanges();
  }

  enableTyping() {
    this.typing = !this.typing;
    this.changeDetectorRef.detectChanges();
  }


  sendAudioData(audioBlob: Blob, email: string) {
    this.addMetadataToAudioFile(audioBlob)
      .then((audioFileWithMetadata) => {
        const formData = new FormData();
        formData.append('audio', audioFileWithMetadata);
        formData.append('email', email);

        this.http.post<Person>(`${environment.pythonUrl}/audio`, formData)
          .subscribe(response => {
            console.log(response);
            // Handle the response from the backend
            // @ts-ignore
            const newUser = response.newProfile;
            this.newProfile = {
              email: "",
              id: "",
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              birthday: newUser.birthday,
              city: newUser.city,
              country: newUser.country,
              phoneNumber: newUser.phoneNumber,
              user_id: newUser.user_id,
              audio_file: newUser.audio_file,
            };
            this.hasNew = true;
            // @ts-ignore
            const existingUser = response.existingProfile;
            if (existingUser) {
              this.existingProfile = {
                email: "",
                id: "",
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                birthday: existingUser.birthday,
                city: existingUser.city,
                country: existingUser.country,
                phoneNumber: existingUser.phoneNumber,
                user_id: existingUser.user_id,
                audio_file: existingUser.audio_file,
              };
              // Check if all values in existing profile are null
              const values = Object.values(existingUser);
              const allNull = values.every(value => value === null);
              this.hasExisting = !allNull;
            } else {
              this.hasExisting = false;
            }
          }, error => {
            console.log(error);
            // Handle any errors
          });
      })
      .catch((error) => {
        console.error('Error adding metadata to audio file:', error);
      });
  }

  sendTranscriptData(email: string, text: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('text', text);

    this.http.post<Person>(`${environment.pythonUrl}/text`, formData)
      .subscribe(response => {
        console.log(response);
        // Handle the response from the backend
        // @ts-ignore
        const newUser = response.newProfile;
        this.newProfile = {
          email: "",
          id: "",
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          birthday: newUser.birthday,
          city: newUser.city,
          country: newUser.country,
          phoneNumber: newUser.phoneNumber,
          user_id: newUser.user_id,
          audio_file: newUser.audio_file,
        };
        this.hasNew = true;
      }, error => {
        console.log(error);
        // Handle any errors
      });
  }

  saveProfile() {
    this.http.post<any>(`${environment.pythonUrl}/save`, this.newProfile)
      .subscribe(response => {
        console.log(response);
        // Handle the response from the backend
        // (e.g., display success message, redirect, etc.)
      }, error => {
        console.log(error);
        // Handle any errors
      });
  }

  addMetadataToAudioFile(audioBlob: Blob): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const audioArrayBuffer = event.target.result;
        const dataView = new DataView(audioArrayBuffer);

        // Modify the metadata values
        const fileSize = dataView.byteLength - 8;
        const chunkSizeOffset = 4;
        const subChunk2SizeOffset = 40;

        // Update the chunk size
        dataView.setUint32(chunkSizeOffset, fileSize, true);

        // Update the subchunk2 size (data size)
        const subChunk2Size = fileSize - 44;
        dataView.setUint32(subChunk2SizeOffset, subChunk2Size, true);

        // Create a new Blob with the modified ArrayBuffer
        const outputBlob = new Blob([audioArrayBuffer], { type: 'audio/wav' });

        // Create a new File with the modified Blob
        const outputFile = new File([outputBlob], 'audio.wav', { type: 'audio/wav' });

        resolve(outputFile);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(audioBlob);
    });
  }


  generateProfile() {
    if (this.recordedAudio) {
      this.sendAudioData(this.recordedAudio, this.email);
    }
    if (this.transcript !+ "") {
      this.sendTranscriptData(this.email, this.transcript);
    }
  }


  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        });

        this.mediaRecorder.start();

        this.recording = true;
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  stopRecording() {
    this.mediaRecorder.stop();

    this.mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(audioBlob);

      this.createWavFile(audioBlob, (wavBlob: Blob) => {
        this.recordedAudio = wavBlob;
        this.downloadUrl = URL.createObjectURL(wavBlob);
      });

      this.recording = false;
    });
  }

  createWavFile(audioBlob: Blob, callback: (wavBlob: Blob) => void) {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result instanceof ArrayBuffer) {
        audioContext.decodeAudioData(fileReader.result)
          .then((audioBuffer) => {
            const wavBuffer = this.audioBufferToWav(audioBuffer);
            const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
            callback(wavBlob);
          })
          .catch((error) => {
            console.error('Error decoding audio data:', error);
          });
      }
    };

    fileReader.readAsArrayBuffer(audioBlob);
  }

  audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const blockAlign = numOfChannels * 2; // 2 bytes per sample for 16-bit audio (numOfChannels * bytesPerSample)
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF identifier
    this.writeString(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 36 + dataSize, true);
    // RIFF type
    this.writeString(view, 8, 'WAVE');
    // format chunk identifier
    this.writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (PCM)
    view.setUint16(20, 1, true);
    // number of channels
    view.setUint16(22, numOfChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, byteRate, true);
    // block align (channels * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    this.writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, dataSize, true);

    // write the PCM samples
    const channelData = [];
    for (let channel = 0; channel < numOfChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const sampleValue = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, sampleValue, true);
        offset += 2;
      }
    }

    return buffer;
  }


  writeString(view: DataView, offset: number, value: string) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  }


  playRecording() {
    const audio = new Audio(this.audioUrl);
    audio.play();
  }

  downloadRecording() {
    if (this.downloadUrl) {
      const link = document.createElement('a');
      link.href = this.downloadUrl;
      link.download = 'recording.wav';
      link.click();
    }
  }
}
