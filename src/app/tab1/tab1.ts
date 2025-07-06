import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';

@Component({
  selector: 'app-tab1',
  template: `
    <form>
      <div class="form-group">
        <label for="field1">Field 1</label>
        <input 
          id="field1" 
          type="text" 
          [value]="field1()"
          (input)="onField1Change($event)"
          [class.error]="field1Error()"
          class="form-control">
        @if (field1Error()) {
          <div class="error-message">{{ field1Error() }}</div>
        }
      </div>
      
      <div class="form-group">
        <label for="field2">Field 2</label>
        <input 
          id="field2" 
          type="text" 
          [value]="field2()"
          (input)="onField2Change($event)"
          [class.error]="field2Error()"
          class="form-control">
        @if (field2Error()) {
          <div class="error-message">{{ field2Error() }}</div>
        }
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class Tab1Component implements IEditDispatchOrderTab {
  // Original values (set when tab initializes)
  private readonly originalField1 = signal('');
  private readonly originalField2 = signal('');
  
  // Current form values
  public readonly field1 = signal('');
  public readonly field2 = signal('');
  
  // Validation errors
  public readonly field1Error = signal<string | null>(null);
  public readonly field2Error = signal<string | null>(null);
  
  // Interface implementation
  readonly hasChanges = computed(() => 
    this.field1() !== this.originalField1() ||
    this.field2() !== this.originalField2()
  );
  
  readonly isValid = computed(() => 
    !this.field1Error() && !this.field2Error()
  );
  
  constructor() {
    // Set up continuous validation
    effect(() => {
      const value = this.field1();
      if (!value.trim()) {
        this.field1Error.set('Field 1 is required');
      } else if (value.length < 3) {
        this.field1Error.set('Field 1 must be at least 3 characters');
      } else {
        this.field1Error.set(null);
      }
    });
    
    effect(() => {
      const value = this.field2();
      if (!value.trim()) {
        this.field2Error.set('Field 2 is required');
      } else {
        this.field2Error.set(null);
      }
    });
  }
  
  public onField1Change(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.field1.set(value);
  }
  
  public onField2Change(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.field2.set(value);
  }
  
  public loadData(field1: string, field2: string) {
    this.originalField1.set(field1);
    this.originalField2.set(field2);
    this.field1.set(field1);
    this.field2.set(field2);
  }
  
  public async save(): Promise<void> {
    if (!this.isValid()) {
      throw new Error('Cannot save invalid data');
    }
    
    console.log('Saving Tab1:', {
      field1: this.field1(),
      field2: this.field2()
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update original values after successful save
    this.originalField1.set(this.field1());
    this.originalField2.set(this.field2());
  }
}