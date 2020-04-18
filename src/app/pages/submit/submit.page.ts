import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

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
    private postService: PostService,
    public auth: AuthService,
    private analytics: AngularFireAnalytics
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
    const user = this.auth.user$.getValue();
    if (!user) {
      console.log('must be signed in to post');
      return;
    }

    const post = {
      ...this.postForm.value,
      lowerCaseTitle: this.postForm.value.title.toLowerCase().trim(),
      lowerCaseType: this.postForm.value.type.toLowerCase().trim(),
      lowerCaseCompany: (this.postForm.value.company || '').toLowerCase().trim(),
      company: this.postForm.value.company || '',
      createdAt: new Date(),
      userId: user.uid,
      userCompany: user.company || this.postForm.value.company || '',
      username: user.username,
      likes: 0,
      followerIds: [user.uid],
      likedIds: []
    };

    const { id } = await this.postService.createPost(post);

    this.postForm.reset();

    this.router.navigateByUrl(`/post-view/${id}`);

    const toasty = await this.toast.create({
      message: 'Post created!',
      duration: 2000
    });

    toasty.present();

    this.analytics.logEvent('new-post');
  }

}
