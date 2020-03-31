import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  darkMode: boolean;

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {
    this.darkMode = !!localStorage.getItem('darkMode');
  }

  darkToggle() {
    const enabled = document.body.classList.toggle('dark');
    if (enabled) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  }

  editInfo() {
    this.router.navigateByUrl('/edit-user');
  }

  viewPosts() {
    this.router.navigateByUrl('/user-posts');
  }

}
