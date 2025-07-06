import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
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

  // SCALABLE - works with any number of fields automatically!
  readonly hasChanges = computed(() => {
    const current = this.form.value as Record<string, any>;
    return Object.keys(current).some(key => current[key] !== this.originalValue[key]);
  });
  
  readonly isValid = computed(() => this.form.valid);

  constructor(private fb: FormBuilder) {
    // Create form in constructor after fb is available
    this.form = this.fb.group({
      field1: ['', [Validators.required, Validators.minLength(3)]],
      field2: ['', Validators.required]
      // Add 100 more fields here - everything still scales!
    });
  }
  
  public loadData(field1: string, field2: string) {
    const data = { field1, field2 };
    this.form.patchValue(data);
    this.originalValue = { ...data };
  }
  
  public async save(): Promise<void> {
    if (!this.isValid()) {
      throw new Error('Cannot save invalid data');
    }
    
    console.log('Saving Tab1:', this.form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.originalValue = { ...this.form.value };
  }
}