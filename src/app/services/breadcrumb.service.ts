import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  title$ = new BehaviorSubject("")

  updateBreadCrumbTitle(title: string) {
    this.title$.next(title)
  }
}
