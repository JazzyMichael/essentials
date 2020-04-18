import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/search/search.module').then(m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/user/user.module').then( m => m.UserPageModule)
          }
        ]
      },
      {
        path: 'submit',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/submit/submit.module').then( m => m.SubmitPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
