import { inject, Injectable } from '@angular/core';
import { Message } from '../models/Message';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  listMessage: Message[] = []

  constructor(private http: HttpClient) {
  }

  addMessageCustomer(message: string): void {
    this.listMessage.push(new Message(message, true, false))
  }

  addMessageIA(message: string): void {
    this.listMessage.push(new Message("", false, true))

    const myData = { 'message': message, 'session_id': 'string' };
    let lastMessage: Message;

    this.http.post('http://127.0.0.1:8000/chat/chat/rag', myData, {
      reportProgress: true,
      observe: 'events',
    }).subscribe(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
        case HttpEventType.Response:
          lastMessage = this.listMessage[this.listMessage.length - 1]
          lastMessage.isOnWriting = false
          if (event.body) {
            let result = (event.body as { response: string }).response
            lastMessage.message = result
          }

          break;
      }
    });
  }

  addFile(contentFile: string) {
    const myData =
    {
      "texts": [
        contentFile
      ],
      "clear_existing": false
    };
    this.http.post('http://127.0.0.1:8000/chat/documents/index', myData, {
      reportProgress: true,
      observe: 'events',
    }).subscribe(event => {
    });

  }

  getMessages(): Message[] {
    return this.listMessage
  }


}
