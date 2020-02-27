import { Observable } from "rxjs";
import { InstrumentEffects } from "./instruments.effects";
import { InstrumentApi, Instrument } from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/instruments.actions";
import { hot, cold } from "jasmine-marbles";
import { provideMockStore } from "@ngrx/store/testing";
import { getFilters } from "state-management/selectors/instruments.selectors";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

describe("InstrumentEffects", () => {
  let actions: Observable<any>;
  let effects: InstrumentEffects;
  let instrumentApi: jasmine.SpyObj<InstrumentApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InstrumentEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            {
              selector: getFilters,
              value: { sortField: "test asc", skip: 0, limit: 25 }
            }
          ]
        }),
        {
          provide: InstrumentApi,
          useValue: jasmine.createSpyObj("instrumentApi", ["find", "findById"])
        }
      ]
    });

    effects = TestBed.get(InstrumentEffects);
    instrumentApi = TestBed.get(InstrumentApi);
  });

  describe("fetchInstruments$", () => {
    describe("ofType fetchInstrumentAction", () => {
      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const instruments = [new Instrument()];
        const action = fromActions.fetchInstrumentsAction();
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.fetchInstrumentsAction();
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });

    describe("ofType changePageAction", () => {
      const page = 0;
      const limit = 25;

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const instruments = [new Instrument()];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });
    describe("ofType changePageAction", () => {
      const page = 0;
      const limit = 25;

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const instruments = [new Instrument()];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });

    describe("ofType sortByColumnAction", () => {
      const column = "test";
      const direction = "asc";

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const instruments = [new Instrument()];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const instruments = [new Instrument()];
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountCompleteAction({
        count: instruments.length
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instruments });
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchInstrument$", () => {
    const pid = "testPid";

    it("should result in a fetchInstrumentCompleteAction", () => {
      const instrument = new Instrument();
      const action = fromActions.fetchInstrumentAction({ pid });
      const outcome = fromActions.fetchInstrumentCompleteAction({ instrument });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instrument });
      instrumentApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchInstrument$).toBeObservable(expected);
    });

    it("should result in a fetchInstrumentFailedAction", () => {
      const action = fromActions.fetchInstrumentAction({ pid });
      const outcome = fromActions.fetchInstrumentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchInstrument$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchInstrumentsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchInstrumentsAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchCountAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentAction", () => {
      it("should dispatch a loadingAction", () => {
        const pid = "testPid";
        const action = fromActions.fetchInstrumentAction({ pid });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchInstrumentsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const instruments = [new Instrument()];
        const action = fromActions.fetchInstrumentsCompleteAction({
          instruments
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchCountCompleteAction({ count });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const instrument = new Instrument();
        const action = fromActions.fetchInstrumentCompleteAction({
          instrument
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
