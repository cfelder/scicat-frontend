import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";

import { combineLatest } from "rxjs";
import { first } from "rxjs/operators";

import { User, Dataset, Job, MessageType } from "state-management/models";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { ClearSelectionAction } from "state-management/actions/datasets.actions";
import { SubmitAction } from "state-management/actions/jobs.actions";
import {
  getCurrentUser,
  getTapeCopies
} from "state-management/selectors/users.selectors";

@Injectable()
export default class ArchivingService {
  private currentUser$ = this.store.pipe(select(getCurrentUser));
  private tapeCopies$ = this.store.pipe(select(getTapeCopies));

  constructor(private store: Store<any>) {}

  public archive(datasets: Dataset[]): void {
    this.archiveOrRetrieve(datasets, true);
  }

  public retrieve(datasets: Dataset[], destinationPath: string): void {
    this.archiveOrRetrieve(datasets, false, destinationPath);
  }

  private createJob(
    user: User,
    datasets: Dataset[],
    archive: boolean,
    destinationPath: string,
    tapeCopies: string
  ): Job {
    const extra = archive ? {} : { destinationPath };
    const jobParams = {
      username: user.username,
      tapeCopies,
      ...extra
    };

    const data = {
      jobParams,
      emailJobInitiator: user.email,
      creationTime: new Date(),
      datasetList: datasets.map(dataset => ({ pid: dataset.pid, files: [] })), // Revise this, files == []...? See earlier version of this method in dataset-table component for context
      type: archive ? "archive" : "retrieve"
    };

    return new Job(data);
  }

  private archiveOrRetrieve(
    datasets: Dataset[],
    archive: boolean,
    destPath?: string
  ): void {
    combineLatest(this.currentUser$, this.tapeCopies$)
      .pipe(first())
      .subscribe(([user, tapeCopies]) => {
        const email = user.email;
        if (!email) {
          return this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content:
                "No email for this user could be found, the job will not be submitted"
            })
          );
        }

        if (datasets.length === 0) {
          return this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content: "No datasets selected"
            })
          );
        }

        const job = this.createJob(
          user,
          datasets,
          archive,
          destPath,
          tapeCopies
        );
        this.store.dispatch(new ClearSelectionAction());
        this.store.dispatch(new SubmitAction(job));
      });
  }
}
