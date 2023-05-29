import {Injectable} from "@angular/core";
import { Subject, map } from "rxjs";
import { DiaryEntry } from "./diary-entry.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class DiaryDataService{

    public maxId: number;
    constructor(private http: HttpClient) {}

    public diarySubject = new Subject<DiaryEntry[]>();
    private diaryEntries: DiaryEntry[] = [];

    onDelete(index: string){
        this.http.delete<{message: string}>('http://localhost:3000/remove-entry/' + index).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getDiaryEntries();
        })
    }

    getDiaryEntries(){
        this.http.get<{diaryEntries: any}>("http://localhost:3000/diary-entries")
        .pipe(map((responseData) => {
            return responseData.diaryEntries.map((entry: {date: string; entry: string; _id: string}) => {
                return {
                    date: entry.date,
                    entry: entry.entry,
                    id: entry._id
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.diaryEntries = updateResponse;
            this.diarySubject.next(this.diaryEntries);
        });
    }

    onAddDiaryEntry(diaryEntry: DiaryEntry){
        this.http.post<{message: string}>('http://localhost:3000/add-entry/', diaryEntry).subscribe((jsonData) => {
            console.log(diaryEntry);
            this.getDiaryEntries();
        });
    }

    getDiaryEntry(id: string){
        const index = this.diaryEntries.findIndex(el => {
            return el.id == id;
        })
        return this.diaryEntries[index];
    }

    onUpdateEntry(id: string, entry: DiaryEntry) {
        this.http.put<{message: string}>('http://localhost:3000/update-entry/' + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getDiaryEntries();
        })
    }
}