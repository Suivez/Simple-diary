import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './diary/diary.component';
import { DiaryFormComponent } from './diary-form/diary-form.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouteGuard } from './shared/route-guard';

const routes: Routes = [
  {
    path: "",
    component: DiaryComponent
  },
  {
    path: "data-entry",
    component: DiaryFormComponent,
    canActivate: [RouteGuard]
  },
  {
    path: "edit/:id",
    component: DiaryFormComponent,
    canActivate: [RouteGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "sign-up",
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule { }
