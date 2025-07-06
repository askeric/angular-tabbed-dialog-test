import { Signal } from "@angular/core";

export interface IEditDispatchOrderTab {
  readonly hasChanges: Signal<boolean>;
  readonly isValid: Signal<boolean>;
  save(): Promise<void>;
}