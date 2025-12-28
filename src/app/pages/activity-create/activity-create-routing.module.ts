import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityCreatePage } from './activity-create.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityCreatePage
  },
  {
    path: ':id',
    component: ActivityCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityCreatePageRoutingModule {}
