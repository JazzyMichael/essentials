import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.page.html',
  styleUrls: ['./submit.page.scss'],
})
export class SubmitPage implements OnInit {
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
      company: [''],
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  async submit() {
    const post = {
      ...this.postForm.value,
      lowerCaseTitle: this.postForm.value.title.toLowerCase().trim(),
      lowerCaseType: this.postForm.value.type.toLowerCase().trim(),
      lowerCaseCompany: this.postForm.value.company.toLowerCase().trim(),
      createdAt: new Date(),
      userId: 'userId'
    };

    const { id } = await this.postService.createPost(post);

    console.log(id);

    this.postForm.reset();

    this.router.navigateByUrl('/post-view');

    const toasty = await this.toast.create({
      message: 'Post created!',
      duration: 2000
    });

    toasty.present();
  }

}
