import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Logbook } from "state-management/models";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent {
  @Input() logbook: Logbook = new Logbook();
  @Input() entriesCount: number | null = 0;
  @Input() entriesPerPage: number | null = 0;
  @Input() currentPage: number | null = 0;

  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  doPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event);
  }

  doSortChange(event: SortChangeEvent) {
    this.sortChange.emit(event);
  }
}
