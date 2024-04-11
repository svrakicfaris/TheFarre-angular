import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ChannelService} from '../../service/genlemen/channel.service';
import {MessageService} from '../../service/genlemen/messages.service';
import {Channel} from '../../models/channel.model';
import {Message} from "../../models/messages.model";
import {UserService} from "../../service/user.service";
import {User} from "../../models/user.model";
import {UserProperty} from "../../models/user-property.enum";
import {ChannelProperty} from "../../models/channel-property.model";
import {UserChannelLastMessageSeenService} from "../../service/genlemen/user_channel_last_message_seen.service";
import {UserChannelLastMessageSeen} from "../../models/user_channel_last_message_seen.model";

@Component({
  selector: 'app-discourse',
  templateUrl: './discourse.component.html',
  styleUrls: ['./discourse.component.css']
})
export class DiscourseComponent implements OnInit {
  @ViewChild('chatContainer', { read: ElementRef }) private chatContainer!: ElementRef;

  containerElement!: HTMLElement;
  scrollHeightBefore = 0; // Define scrollHeightBefore as a global variable

  //User currently accessing discourse
  user!: User;
  lastSeenMessages: UserChannelLastMessageSeen[] = []; //All lastSeenMessages


  //Channel data
  channels: Channel[] = []; //All channels
  channelsLoading: boolean = true; //Are channels loading?
  currentChannel: Channel = {
    _id: '0',
    name: 'No Channels'
  }; //Channel clicked by user

  //Message data
  messages: any[] = []; //Messages from one channel
  newMessageText: string = ''; //New message text
  messagesLoading: boolean = true; //Are initial messages loading?
  newMessagesLoading: boolean = false; //Are new messages loading?
  noMoreMessages: boolean = false; //Are there more messages to be loaded?
  lastSeenMessageId: string = ''; // Last massage user saw in one channel
  newLastSeenMessageId: string = ''; // Last massage user saw in one channel


  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  selectedMessage: any; // The message the user right-clicked on

  currentPage: number = 1; //for retrieving messages from database
  pageSize: number = 10; // Number of messages to retrieve per page


  constructor(
    private channelService: ChannelService,
    private messageService: MessageService,
    private userService: UserService,
    private userChannelLastMessageSeenService: UserChannelLastMessageSeenService,
  ) {}

  async ngOnInit(): Promise<void> {
    // Retrieve user data
    await this.fetchUser();

    //Call getUserChannelLastMessageSeen from service
    this.userChannelLastMessageSeenService.getUserChannelLastMessageSeen(this.user[UserProperty.id]!).subscribe(
      (lastSeenMessages: UserChannelLastMessageSeen[]) => {
        this.lastSeenMessages = lastSeenMessages;
      }, (error) => {
        console.error('Failed to fetch last seen messaged:', error);
      }
    );

    // Get all channels
    this.channelService.getChannels().subscribe(
      (channels: Channel[]) => {
        this.channels = channels;
        this.channelsLoading = false; // Set channelsLoading to false after channels are loaded
        this.changeChannel(this.channels[0]);
      },
      (error) => {
        console.error('Failed to fetch channels:', error);
        this.channelsLoading = false; // Set channelsLoading to false in case of an error
      }
    );

    // Scroll to bottom of the chat page
    /*this.scrollToBottom();*/
  }

  async changeChannel(channel: Channel): Promise<void> {
    this.lastSeenMessageId = '';

    // Update messageId in lastSeenMessages if channelId matches
    if (this.lastSeenMessageId === '') {
      console.log("HERE")
      //find last seen message in channel
      const channelLastSeenMessage = this.lastSeenMessages.find(item => item.channelId === this.currentChannel[ChannelProperty.id]);
      if (channelLastSeenMessage && channelLastSeenMessage.messageId != this.newLastSeenMessageId) {
        console.log("and here")
        channelLastSeenMessage.messageId = this.newLastSeenMessageId;
        await this.userChannelLastMessageSeenService.putUserChannelLastMessageSeen(channelLastSeenMessage)
          .subscribe(
            (response: UserChannelLastMessageSeen) => {
              // Handle the response if needed
              console.log('User channel last message seen updated:', response);
            },
            (error) => {
              console.error('Failed to put user channel last message seen:', error);
            },
            () => {
              // Request completed
              console.log('User channel last message seen request completed');
            }
          );
      }
      console.log(this.newLastSeenMessageId);
      console.log(channelLastSeenMessage);
      console.log(this.lastSeenMessages)
    }
    //update lastSeenMessages[] there channelId is the same as this.currentChannel with this.newLastSeenMessageId

    this.currentChannel = channel;
    this.currentPage = 1; // Reset the page number to 1
    this.messagesLoading = true; // Messages are loading
    this.noMoreMessages = false; // There are messages to be loaded
    this.messages = []; // Clear the existing messages

    await this.fetchMessages();

    const lastSeenMessage = this.lastSeenMessages.find(item => item.channelId === this.currentChannel[ChannelProperty.id]);
    this.lastSeenMessageId = lastSeenMessage ? lastSeenMessage.messageId : '';
    this.newLastSeenMessageId = this.lastSeenMessageId

    if(this.lastSeenMessageId !== '-1')
    {
      let lastSeenMessageIndex = this.messages.findIndex(message => message._id === this.lastSeenMessageId);
      while (lastSeenMessageIndex === -1 && !this.noMoreMessages) {
        this.currentPage++;
        await this.fetchMessages();
        lastSeenMessageIndex = this.messages.findIndex(message => message._id === this.lastSeenMessageId);
      }

      setTimeout(() => {
        this.scrollToMessage(this.lastSeenMessageId);
      });
    }
    else {
      this.lastSeenMessageId = this.messages[this.messages.length - 1]._id;
      this.newLastSeenMessageId = this.messages[this.messages.length - 1]._id;
      console.log(this.messages)
      console.log(this.messages[0]._id)

      setTimeout(() => {
        this.scrollToBottom()
      });
    }

  }

  fetchMessages(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.messageService.getMessages(this.currentChannel[ChannelProperty.id]!, this.currentPage).subscribe(
        (messages: Message[]) => {
          // Reverse the order of the new messages
          const reversedMessages = messages.reverse();

          // Prepend the reversed messages at the beginning of the array
          this.messages.unshift(...reversedMessages);
          this.newMessagesLoading = false;
          this.messagesLoading = false;

          if (this.containerElement != undefined) {
            setTimeout(() => {
              // Calculate the updated scroll position
              const scrollHeightAfter = this.containerElement.scrollHeight;

              const scrollTopOffset = scrollHeightAfter - this.scrollHeightBefore;
              // Scroll to the updated position
              this.containerElement.scrollTop += scrollTopOffset;
            });
          }

          // Check if there are more messages available
          if (messages.length < this.pageSize) {
            // Disable further scrolling
            this.noMoreMessages = true;
          }

          resolve();
        },
        (error) => {
          console.error('Failed to fetch messages:', error);
          this.newMessagesLoading = false;
          reject(error);
        }
      );
    });
  }

  getLastMessageId(): string{
    if (this.lastSeenMessageId !== this.messages[this.messages.length - 1]._id){
      return this.lastSeenMessageId;
    }
    else{
      return ''

    }
  }



  scrollTo(messageId: string | null): void {
    if (messageId)
    {
      this.scrollToMessage(messageId)
    }
    else {
      this.scrollToBottom()
    }
  }

  scrollToMessage(messageId: string): void {
    if (messageId) {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    } else {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  changeChannel2(channel: Channel): void {
    this.currentChannel = channel;
    this.currentPage = 1; // Reset the page number to 1
    this.messagesLoading = true; // Messages are loading
    this.noMoreMessages = false; // There are messages to be loaded
    this.messages = []; // Clear the existing messages

    this.fetchMessages();

    //Find the last message seen by user
    const lastSeenMessage = this.lastSeenMessages.find(item => item.channelId === this.currentChannel[ChannelProperty.id]);
    this.lastSeenMessageId = lastSeenMessage ? lastSeenMessage.messageId : '';

    //Find message
    let lastSeenMessageIndex = this.messages.findIndex(message => message.id === this.lastSeenMessageId);
    while (lastSeenMessageIndex === -1)
    {
      this.currentPage++;
      this.fetchMessages();
      lastSeenMessageIndex = this.messages.findIndex(message => message.id === this.lastSeenMessageId);
    }
    this.lastSeenMessageId = lastSeenMessage ? lastSeenMessage.messageId : '';

    this.scrollTo(this.lastSeenMessageId);
  }


  onScroll(): void {
    const containerElement = this.chatContainer.nativeElement;
    const scrollTop = containerElement.scrollTop;
    const clientHeight = containerElement.clientHeight;

    // Calculate the scroll position for determining the last seen message
    const scrollPosition = scrollTop + clientHeight;

    // Find the message element closest to the scroll position
    const messageElements = containerElement.getElementsByClassName('message');
    let lastSeenMessageId = '';

    // TOo many checks, but works
    let tempMessEl = messageElements[0] as HTMLElement;
    for (let i = 0; i < messageElements.length; i++) {
      const messageElement = messageElements[i] as HTMLElement;
      const tempPosition = (tempMessEl.offsetTop - containerElement.offsetTop) +  tempMessEl.clientHeight;
      const messagePosition = (messageElement.offsetTop - containerElement.offsetTop) +  messageElement.clientHeight;

      if (messagePosition < scrollPosition && messagePosition > tempPosition) {
        // The message is below the scroll position, so the previous message is the last seen one
        tempMessEl = messageElements[i] as HTMLElement;
        lastSeenMessageId = tempMessEl.dataset['messageId'] || '';
      }
    }

    // Check if the current message is newer than the stored last seen message
    const currentIndex = this.messages.findIndex(message => message._id === lastSeenMessageId);
    const lastIndex = this.messages.findIndex(message => message._id === this.newLastSeenMessageId);

    if (currentIndex > lastIndex) {
      // Only update newLastSeenMessageId if the current message is older
      this.newLastSeenMessageId = lastSeenMessageId;
    }

    // Check if the user has scrolled to the top and scrolling is enabled
    if (scrollTop === 0 && !this.newMessagesLoading && !this.noMoreMessages) {
      // Disable further scrolling until new messages are fetched
      this.newMessagesLoading = true;

      // Data to keep chat in position when new loads
      this.containerElement = this.chatContainer.nativeElement;
      this.scrollHeightBefore = containerElement.scrollHeight;
      // Increment the current page and fetch older messages
      this.currentPage++;
      this.fetchMessages();
    }
  }



  sendMessage(): void {
    // Create a new message object
    const newMessage = {
      userId: this.user[UserProperty.username],
      user: this.userService.getUser(),
      text: this.newMessageText,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      channelId: this.currentChannel[ChannelProperty.id]
    };

    // Call the postMessage function from the MessageService
    this.messageService.postMessage(newMessage).subscribe(
      () => {
        // Message sent successfully, add it to the messages array
        this.messages.push(newMessage);
        this.newMessageText = ''; // Clear the input field
        this.scrollToBottom();
      },
      (error) => {
        console.error('Failed to send message:', error);
      }
    );
  }

  getUserUsername() {
    return this.userService.getUser()[UserProperty.username];
  }


  /*scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    });
  }*/

  onMessageContextMenu(event: MouseEvent, message: any) {
    event.preventDefault(); // Prevent the default browser context menu
    this.selectedMessage = message;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.showContextMenu = true;
  }

  editMessage(message: any) {
    // Implement your edit logic here
    // For example, you could toggle a property to enable editing mode
    message.editing = true;
  }

  deleteMessage(message: any) {
    // Implement your delete logic here
    // For example, remove the message from the messages array
    const index = this.messages.indexOf(message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }

    // Hide the context menu after deleting
    this.showContextMenu = false;
  }

  isEditing(message: any): boolean {
    return message.editing || false; // Return true if the message is in editing mode
  }

  onBlur(event: any, message: any) {
    // Save the edited message when the input loses focus (blur event)
    message.text = event.target.textContent;
    message.editing = false; // Disable editing mode
  }










  fetchUser() {
      this.user = this.userService.getUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Get the element that was clicked
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is within the context menu or its parent container
    const contextMenu = document.querySelector('.context-menu');
    const messagesContainer = document.querySelector('.messages-container');

    if (!contextMenu?.contains(clickedElement) && !messagesContainer?.contains(clickedElement)) {
      // If the clicked element is outside of the context menu and its parent container, hide the context menu
      this.showContextMenu = false;
    }
  }
}
