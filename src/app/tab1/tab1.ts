import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Tab1Component implements IEditDispatchOrderTab {
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
      field1: ['', [Validators.required, Validators.minLength(3)]],
      field2: ['', Validators.required]
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
  
  public loadData(field1: string, field2: string) {
    const data = { field1, field2 };
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
    
    console.log('Saving Tab1:', this.form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.originalValue = { ...this.form.value };
    this.formValue.set(this.form.value); // Update signal after save
  }
}