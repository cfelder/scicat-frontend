import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { FlatNodeEdit } from "../tree-edit/tree-edit.component";
import { MetadataInputBase, Type } from "../base-classes/metadata-input-base";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { DateTime } from "luxon";
export interface InputData {
  type: string;
  key: string;
  value: any;
  unit?: string;
}
export interface MetadataInput {
  valid: boolean;
  data: InputData;
}

@Component({
  selector: "metadata-input",
  templateUrl: "./metadata-input.component.html",
  styleUrls: ["./metadata-input.component.scss"]
})
export class MetadataInputComponent extends MetadataInputBase implements OnInit {
  changeDetection: Subscription = new Subscription();
  types: string[] = [];
  @Input() data: FlatNodeEdit = new FlatNodeEdit();
  @Output() save = new EventEmitter<MetadataInput | null>();
  @Output() cancel = new EventEmitter();
  @Output() changed = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private formatNumberPipe: FormatNumberPipe) {
    super();
  }
  ngOnInit() {
    this.metadataForm = this.initilizeFormControl();
    this.addCurrentMetadata(this.data);
    this.changeDetection = this.metadataForm.valueChanges.subscribe(() => {
      this.changed.emit();
      this.changeDetection.unsubscribe();
    });
  }

  initilizeFormControl() {
    const field = this.formBuilder.group({
      type: new FormControl("", [Validators.required]),
      key: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      value: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      unit: new FormControl("", [
        Validators.required,
        this.unitValidator(),
      ]),
    });
    return field;
  }
  addCurrentMetadata(node: FlatNodeEdit) {
    if (node.expandable) {
      this.metadataForm.get("type")?.setValue(Type.string);
      this.metadataForm.get("key")?.setValue(node.key);
      this.metadataForm.get("value")?.disable();
      this.typeValues = ["string"];
    } else {
      if (node.unit) {
        this.metadataForm.get("type")?.setValue(Type.quantity);
        this.metadataForm.get("key")?.setValue(node.key);
        const formattedValue = this.formatNumberPipe.transform(node.value);
        this.metadataForm.get("value")?.setValue(formattedValue || "");
        this.metadataForm.get("unit")?.setValue(node.unit);
      } else if (typeof node.value === Type.number) {
        this.metadataForm.get("type")?.setValue(Type.number);
        this.metadataForm.get("key")?.setValue(node.key);
        this.metadataForm.get("value")?.setValue(node.value);
      } else if (typeof node.value === Type.boolean){
        this.metadataForm.get("type")?.setValue(Type.boolean);
        this.metadataForm.get("key")?.setValue(node.key);
        this.metadataForm.get("value")?.setValue(String(node.value));
      } else if (this.dateTimeService.isISODateTime(node.value)) {
        this.metadataForm.get("type")?.setValue(Type.date);
        this.metadataForm.get("key")?.setValue(node.key);
        this.metadataForm.get("value")?.setValue(DateTime.fromISO(node.value).toLocal().toISO());
      } else {
        this.metadataForm.get("type")?.setValue(Type.string);
        this.metadataForm.get("key")?.setValue(node.key);
        this.metadataForm.get("value")?.setValue(node.value);
      }
    }
    this.detectType();
  }
  onSave() {
    if (this.metadataForm.dirty) {
      this.save.emit(this.metadataForm.value);
    } else {
      this.cancel.emit();
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
