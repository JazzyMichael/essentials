import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thumbnail-list',
  templateUrl: './thumbnail-list.component.html',
  styleUrls: ['./thumbnail-list.component.scss'],
})
export class ThumbnailListComponent {
  @Input() posts: any[] = [];

  constructor() { }

}
