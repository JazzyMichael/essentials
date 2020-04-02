import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
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

  viewPosts(id: string) {
    this.router.navigateByUrl(`/user-posts/${id}`);
  }

}
