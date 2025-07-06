import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';

// Custom validator for future date
function futureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare just dates
  return inputDate > today ? null : { futureDate: true };
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Tab2Component implements IEditDispatchOrderTab {
  public readonly form: FormGroup;
  private originalValue: Record<string, any> = {};
  
  // Convert form state to signals so computed signals can track them
  private readonly formValue = signal<Record<string, any>>({});
  private readonly formValid = signal(false);

  // Now these will react to form changes!
  readonly hasChanges = computed(() => {
    const current = this.formValue();
    return Object.keys(current).some(key => current[key] !== this.originalValue[key]);
  });
  
  readonly isValid = computed(() => this.formValid());

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      field3: ['', [Validators.required, Validators.minLength(10)]],
      field4: ['', [Validators.required, futureDate]]
    });
    
    // Subscribe to form changes and update signals
    this.form.valueChanges.subscribe(value => {
      this.formValue.set(value);
    });
    
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
    
    // Initialize signals
    this.formValue.set(this.form.value);
    this.formValid.set(this.form.valid);
  }
  
  public loadData(field3: string, field4: string) {
    const data = { field3, field4 };
    this.form.patchValue(data);
    this.originalValue = { ...data };
    
    // Update signals after loading data
    this.formValue.set(this.form.value);
    this.formValid.set(this.form.valid);
  }
  
  public async save(): Promise<void> {
    if (!this.isValid()) {
      throw new Error('Cannot save invalid data');
    }
    
    console.log('Saving Tab2:', this.form.value);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update original value to mark as "clean"
    this.originalValue = { ...this.form.value };
    
    // Force signal update with new object reference (critical for change detection)
    this.formValue.set({ ...this.form.value });
  }
}