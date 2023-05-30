import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiaryDataService } from '../shared/diary-data.component';
import { DiaryEntry } from '../shared/diary-entry.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription;
  isAuthenticated = false;

  constructor(private diaryDataService: DiaryDataService, private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.diarySubscription.unsubscribe();
    this.authenticationSub.unsubscribe();
  }

  diaryEntries: DiaryEntry[];
  diarySubscription = new Subscription();

  ngOnInit(): void {
    this.diaryDataService.getDiaryEntries();
    this.diarySubscription = this.diaryDataService.diarySubject.subscribe(entries => {
      this.diaryEntries = entries;
    });
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      
    })
    this.isAuthenticated = this.authService.getIsAuthenticated();
  }

  onDelete(index: string){
    this.diaryDataService.onDelete(index);
  }

  onEdit(index: string){
    this.router.navigate(["edit", index]);
  }
}
