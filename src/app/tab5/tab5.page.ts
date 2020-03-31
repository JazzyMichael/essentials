import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.postForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  async submit() {
    const post = {
      ...this.postForm.value,
      lowercaseTitle: this.postForm.value.title.toLowerCase().trim(),
      lowercaseType: this.postForm.value.type.toLowerCase().trim(),
      createdAt: new Date(),
      userId: 'userId'
    };

    this.postService.createPost(post);

    this.postForm.reset();

    this.router.navigateByUrl('/post-view');

    const toasty = await this.toast.create({
      message: 'Post created!',
      duration: 2000
    });

    toasty.present();
  }

}
