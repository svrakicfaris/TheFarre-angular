import { Component } from '@angular/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent {

  ngOnInit(): void {
    const linkInstagram = document.getElementById('instagramLink') as HTMLElement;
    const linkTwitter = document.getElementById('twitterLink') as HTMLElement;
    const linkedinLink = document.getElementById('linkedinLink') as HTMLElement;
    const facebookLink = document.getElementById('facebookLink') as HTMLElement;

    if (linkInstagram) {
      linkInstagram.addEventListener('mousemove', (e) => {
        const imageElement = linkInstagram.querySelector('.background-image');
        if (imageElement) {
          const rect = linkInstagram.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) * 0.1; // Adjust the value as needed
          const moveY = (e.clientY - centerY) * 0.1; // Adjust the value as needed

          (imageElement as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
        }
      });

      linkInstagram.addEventListener('mouseout', () => {
        const imageElement = linkInstagram.querySelector('.background-image');
        if (imageElement) {
          (imageElement as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    }

    if (linkTwitter) {
      linkTwitter.addEventListener('mousemove', (e) => {
        const imageElement = linkTwitter.querySelector('.background-image');
        if (imageElement) {
          const rect = linkTwitter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) * 0.1; // Adjust the value as needed
          const moveY = (e.clientY - centerY) * 0.1; // Adjust the value as needed

          (imageElement as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
        }
      });

      linkTwitter.addEventListener('mouseout', () => {
        const imageElement = linkTwitter.querySelector('.background-image');
        if (imageElement) {
          (imageElement as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    }

    if (linkedinLink) {
      linkedinLink.addEventListener('mousemove', (e) => {
        const imageElement = linkedinLink.querySelector('.background-image');
        if (imageElement) {
          const rect = linkedinLink.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) * 0.1; // Adjust the value as needed
          const moveY = (e.clientY - centerY) * 0.1; // Adjust the value as needed

          (imageElement as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
        }
      });

      linkedinLink.addEventListener('mouseout', () => {
        const imageElement = linkedinLink.querySelector('.background-image');
        if (imageElement) {
          (imageElement as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    }

    if (facebookLink) {
      facebookLink.addEventListener('mousemove', (e) => {
        const imageElement = facebookLink.querySelector('.background-image');
        if (imageElement) {
          const rect = facebookLink.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) * 0.1; // Adjust the value as needed
          const moveY = (e.clientY - centerY) * 0.1; // Adjust the value as needed

          (imageElement as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
        }
      });

      facebookLink.addEventListener('mouseout', () => {
        const imageElement = facebookLink.querySelector('.background-image');
        if (imageElement) {
          (imageElement as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    }
  }
}
