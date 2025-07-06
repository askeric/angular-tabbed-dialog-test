import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';


@Component({
  selector: 'app-tab2',
  template: `
    <form>
      <div class="form-group">
        <label for="field3">Field 3</label>
        <textarea 
          id="field3" 
          [value]="field3()"
          (input)="onField3Change($event)"
          [class.error]="field3Error()"
          class="form-control"
          rows="3"></textarea>
        @if (field3Error()) {
          <div class="error-message">{{ field3Error() }}</div>
        }
      </div>
      
      <div class="form-group">
        <label for="field4">Field 4</label>
        <input 
          id="field4" 
          type="date" 
          [value]="field4()"
          (input)="onField4Change($event)"
          [class.error]="field4Error()"
          class="form-control">
        @if (field4Error()) {
          <div class="error-message">{{ field4Error() }}</div>
        }
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class Tab2Component implements IEditDispatchOrderTab {
  private readonly originalField3 = signal('');
  private readonly originalField4 = signal('');
  
  public readonly field3 = signal('');
  public readonly field4 = signal('');
  
  public readonly field3Error = signal<string | null>(null);
  public readonly field4Error = signal<string | null>(null);
  
  readonly hasChanges = computed(() => 
    this.field3() !== this.originalField3() ||
    this.field4() !== this.originalField4()
  );
  
  readonly isValid = computed(() => 
    !this.field3Error() && !this.field4Error()
  );
  
  constructor() {
    effect(() => {
      const value = this.field3();
      if (!value.trim()) {
        this.field3Error.set('Field 3 is required');
      } else if (value.length < 10) {
        this.field3Error.set('Field 3 must be at least 10 characters');
      } else {
        this.field3Error.set(null);
      }
    });
    
    effect(() => {
      const value = this.field4();
      if (!value) {
        this.field4Error.set('Field 4 is required');
      } else if (new Date(value) <= new Date()) {
        this.field4Error.set('Field 4 must be in the future');
      } else {
        this.field4Error.set(null);
      }
    });
  }
  
  public onField3Change(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.field3.set(value);
  }
  
  public onField4Change(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.field4.set(value);
  }
  
  public loadData(field3: string, field4: string) {
    this.originalField3.set(field3);
    this.originalField4.set(field4);
    this.field3.set(field3);
    this.field4.set(field4);
  }
  
  public async save(): Promise<void> {
    if (!this.isValid()) {
      throw new Error('Cannot save invalid data');
    }
    
    console.log('Saving Tab2:', {
      field3: this.field3(),
      field4: this.field4()
    });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.originalField3.set(this.field3());
    this.originalField4.set(this.field4());
  }
}
