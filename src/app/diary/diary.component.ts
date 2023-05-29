import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiaryDataService } from '../shared/diary-data.component';
import { DiaryEntry } from '../shared/diary-entry.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit, OnDestroy {

  diaryEntries: DiaryEntry[];
  diarySubscription = new Subscription();

  constructor(private diaryDataService: DiaryDataService, private router: Router) {}

  ngOnInit(): void {
    this.diaryDataService.getDiaryEntries();
    this.diarySubscription = this.diaryDataService.diarySubject.subscribe(entries => {
      this.diaryEntries = entries;
    });
  }

  ngOnDestroy(): void {
    this.diarySubscription.unsubscribe();
  }

  onDelete(index: string){
    this.diaryDataService.onDelete(index);
  }

  onEdit(index: string){
    this.router.navigate(["edit", index]);
  }
}
