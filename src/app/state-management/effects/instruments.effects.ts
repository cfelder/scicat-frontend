import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InstrumentApi, Instrument } from "shared/sdk";
import * as fromActions from "state-management/actions/instruments.actions";
import {
  switchMap,
  map,
  catchError,
  mergeMap,
  withLatestFrom
} from "rxjs/operators";
import { of } from "rxjs";
import { Store, select } from "@ngrx/store";
import { getFilters } from "state-management/selectors/instruments.selectors";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

@Injectable()
export class InstrumentEffects {
  filters$ = this.store.pipe(select(getFilters));

  fetchInstruments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction
      ),
      withLatestFrom(this.filters$),
      map(([action, filters]) => filters),
      switchMap(({ sortField: order, skip, limit }) =>
        this.instrumentApi.find({ order, limit, skip }).pipe(
          mergeMap((instruments: Instrument[]) => [
            fromActions.fetchInstrumentsCompleteAction({ instruments }),
            fromActions.fetchCountAction()
          ]),
          catchError(() => of(fromActions.fetchInstrumentsFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.instrumentApi.find().pipe(
          map(instruments =>
            fromActions.fetchCountCompleteAction({ count: instruments.length })
          ),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  fetchInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchInstrumentAction),
      switchMap(({ pid }) =>
        this.instrumentApi.findById(pid).pipe(
          map((instrument: Instrument) =>
            fromActions.fetchInstrumentCompleteAction({ instrument })
          ),
          catchError(() => of(fromActions.fetchInstrumentFailedAction()))
        )
      )
    )
  );

  loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsAction,
        fromActions.fetchCountAction,
        fromActions.fetchInstrumentAction
      ),
      switchMap(() => of(loadingAction()))
    )
  );

  loadingComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsCompleteAction,
        fromActions.fetchInstrumentsFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchInstrumentCompleteAction,
        fromActions.fetchInstrumentFailedAction
      ),
      switchMap(() => of(loadingCompleteAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private instrumentApi: InstrumentApi,
    private store: Store<Instrument>
  ) {}
}
