import {
  OnInit,
  Component,
  Input
} from '@angular/core';

import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

import {
  SubscribeService
} from '../services/subscribe.service';

@Component({
  moduleId: module.id,
  selector: 'app-profile-unsubscribe-selector',
  templateUrl: `./profile-unsubscribe.component.html`
})

export class ProfileUnsubscribeComponent implements OnInit {
  @Input() public subscriberEmail: string;
  isSubscribed: boolean;

  constructor(
    private modalService: NgbModal,
    private subscribeService: SubscribeService
  ) {}

  ngOnInit() {
    this.subscribeService.GetSubscriber(this.subscriberEmail).subscribe((data: any) => {
      this.isSubscribed = data.subscriber ? true : false;
    })
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    });
    // .result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
}
