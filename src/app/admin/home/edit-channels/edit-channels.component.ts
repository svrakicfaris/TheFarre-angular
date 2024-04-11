import {Component, OnInit} from '@angular/core';
import {ChannelService} from "../../../service/genlemen/channel.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-edit-channels',
  templateUrl: './edit-channels.component.html',
  styleUrls: ['./edit-channels.component.css']
})
export class EditChannelsComponent implements OnInit{
  name!: string;
  _id!: string;
  channels: any[] = [];
  isEditingChannel: boolean = false;
  editedChannel: any = {};

  constructor(private channelService: ChannelService) {}

  ngOnInit() {
    this.getChannels();
  }

  getChannels() {
    this.channelService.getChannels().subscribe(
      (response) => {
        this.channels = response;
      },
      (error) => {
        console.error('Failed to get channels:', error);
      }
    );
  }

  handleSubmit() {
    const channel = {
      name: this.name,
      orderNumber: this.channels.length + 1,
      _id: this._id,
    };
    if (this.isEditingChannel) {
      // Call putCategories if editing
      this.channelService.putChannel(channel).subscribe(
        (response) => {
          console.log('Entry updated successfully');
          // Reset the form and editing variables
          this.resetForm();
        },
        (error) => {
          console.error('Failed to update entry:', error);
        }
      );
    } else {
      if (this.name) {
        this.channelService.createChannel(channel).subscribe(
          (response) => {
            console.log('Channel created successfully');
            this.name = '';
            this.getChannels();
          },
          (error) => {
            console.error('Failed to create channel:', error);
          }
        );
      }
    }
  }

  resetForm() {
    this.name = '';
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.channels, event.previousIndex, event.currentIndex);
  }

  onDragStart(event: DragEvent, category: any) {
    event.dataTransfer!.setData('category', JSON.stringify(category));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  insertForm(channel: any) {
    this.isEditingChannel = true;
    this.editedChannel = { ...channel };
    this.name = this.editedChannel.name;
    this._id = this.editedChannel._id;
  }

  cancelEditing() {
    this.isEditingChannel = false;
    this.editedChannel = {};
    this.resetForm();
  }

  updateChannels() {
    this.channels.forEach((channel, index) => {
      const updatedChannel = {
        ...channel,
        orderNumber: index + 1
      };
      this.channelService.putChannel(updatedChannel).subscribe(
        (response) => {
          console.log(`Category ${channel._id} updated successfully`);
        },
        (error) => {
          console.error(`Failed to update category ${channel._id}:`, error);
        }
      );
    });
    this.isEditingChannel = false;
    this.editedChannel = {};
  }


  removeChannel(channelId: string) {
    const data = {
      _id: channelId
    };

    this.channelService.deleteChannel(data).subscribe(
      (response) => {
        console.log('Category deleted successfully');
        // Remove the category from the local array
        this.channels = this.channels.filter((channel) => channel._id !== channelId);
        this.updateChannels();
      },
      (error) => {
        console.error('Failed to delete category:', error);
      }
    );
  }

}
