import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tournament } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class TournamentStateService {
  private _tournaments  = new BehaviorSubject<Tournament[]>([]);
  private _selected     = new BehaviorSubject<Tournament | null>(null);
  private _loading      = new BehaviorSubject<boolean>(false);

  tournaments$ = this._tournaments.asObservable();
  selected$    = this._selected.asObservable();
  loading$     = this._loading.asObservable();

  setTournaments(data: Tournament[]): void { this._tournaments.next(data); }
  setSelected(t: Tournament | null): void  { this._selected.next(t); }
  setLoading(v: boolean): void             { this._loading.next(v); }

  get tournaments(): Tournament[] { return this._tournaments.getValue(); }
  get selected(): Tournament | null { return this._selected.getValue(); }
}
