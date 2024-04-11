import { Component } from '@angular/core';

@Component({
  selector: 'app-event-organization',
  templateUrl: './event-organization.component.html',
  styleUrls: ['./event-organization.component.css']
})
export class EventOrganizationComponent {

  constructor() {
  }

  timeLine = [{ year: 'May 2023', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' },
    { year: '2016', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.'},

  ]
}
