import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { Tab1Component } from '../tab1/tab1';
import { Tab2Component } from '../tab2/tab2';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';

@Component({
  selector: 'app-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Edit Dispatch Order</h2>
        <button class="close-btn" (click)="onClose()">&times;</button>
      </div>
      
      <div class="dialog-body">
        <div class="tab-container">
          <div class="tab-headers">
            <button 
              class="tab-header" 
              [class.active]="activeTabId() === 'tab1'"
              [class.has-changes]="tab1?.hasChanges()"
              [class.has-errors]="tab1 && !tab1.isValid()"
              (click)="setActiveTab('tab1')">
              Tab 1
              @if (tab1?.hasChanges()) {
                <span class="change-indicator">●</span>
              }
              @if (tab1 && !tab1.isValid()) {
                <span class="error-indicator">⚠</span>
              }
            </button>
            
            <button 
              class="tab-header" 
              [class.active]="activeTabId() === 'tab2'"
              [class.has-changes]="tab2?.hasChanges()"
              [class.has-errors]="tab2 && !tab2.isValid()"
              (click)="setActiveTab('tab2')">
              Tab 2
              @if (tab2?.hasChanges()) {
                <span class="change-indicator">●</span>
              }
              @if (tab2 && !tab2.isValid()) {
                <span class="error-indicator">⚠</span>
              }
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Always render both tabs but show/hide them -->
            <div class="tab-panel" [style.display]="activeTabId() === 'tab1' ? 'block' : 'none'">
              <app-tab1 #tab1Ref></app-tab1>
            </div>
            
            <div class="tab-panel" [style.display]="activeTabId() === 'tab2' ? 'block' : 'none'">
              <app-tab2 #tab2Ref></app-tab2>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dialog-footer">
        <div class="status-info">
          <div class="status-row">
            @if (getChangesCount() > 0) {
              <span class="changes-count">
                {{ getChangesCount() }} tab(s) with changes
              </span>
            }
          </div>
          <div class="status-row">
            @if (!getCanSave() && getChangesCount() > 0) {
              <span class="error-message">
                Cannot save: some tabs have validation errors
              </span>
            }
            @if (getCanSave() && getChangesCount() > 0) {
              <span class="success-message">
                Ready to save {{ getChangesCount() }} tab(s)
              </span>
            }
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="onClose()">
            Cancel
          </button>

          <div style="background: yellow; padding: 5px; font-size: 12px; margin-bottom: 5px;">
            TAB1: hasChanges={{ tab1?.hasChanges() }}, isValid={{ tab1?.isValid() }}<br>
            TAB2: hasChanges={{ tab2?.hasChanges() }}, isValid={{ tab2?.isValid() }}<br>
            COMPUTED: changes={{ getChangesCount() }}, canSave={{ getCanSave() }}
          </div>
          <button 
            class="btn btn-primary"
            [disabled]="!getCanSave()"
            (click)="onSave()"
            style="padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
            [style.background]="getCanSave() ? '#007bff' : '#6c757d'"
            [style.opacity]="getCanSave() ? '1' : '0.6'">
            {{ isSaving() ? 'Saving...' : 'Save All Changes' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 800px;
      max-height: 600px;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #ddd;
    }
    
    .dialog-header h2 {
      margin: 0;
      color: #333;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    
    .close-btn:hover {
      color: #000;
    }
    
    .tab-headers {
      display: flex;
      border-bottom: 1px solid #ddd;
      background: #f8f9fa;
    }
    
    .tab-header {
      padding: 12px 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    
    .tab-header:hover {
      background: rgba(0,0,0,0.05);
    }
    
    .tab-header.active {
      background: white;
      border-bottom: 3px solid #007bff;
      font-weight: 600;
    }
    
    .tab-header.has-changes:not(.active) {
      background: #fff3cd;
      border-bottom: 3px solid #ffc107;
    }
    
    .tab-header.has-errors:not(.active) {
      background: #f8d7da;
      border-bottom: 3px solid #dc3545;
      color: #721c24;
    }
    
    .tab-header.has-errors.active {
      border-bottom: 3px solid #dc3545;
    }
    
    .change-indicator {
      color: #856404;
      font-weight: bold;
    }
    
    .error-indicator {
      color: #721c24;
      font-weight: bold;
    }
    
    .tab-content {
      padding: 20px;
      min-height: 300px;
      flex: 1;
    }
    
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #ddd;
      background: #f8f9fa;
    }
    
    .status-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .status-row {
      min-height: 16px;
    }
    
    .changes-count {
      color: #666;
      font-size: 14px;
    }
    
    .success-message {
      color: #28a745;
      font-size: 12px;
    }
    
    .error-message {
      color: #dc3545;
      font-size: 12px;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #5a6268;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn.loading {
      opacity: 0.8;
    }
    
    /* Form styling for tabs */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .form-control.error {
      border-color: #dc3545;
    }
    
    .form-control.error:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220,53,69,0.25);
    }
  `],
  standalone: true,
  imports: [CommonModule, Tab1Component, Tab2Component]
})
export class DialogComponent implements OnInit, AfterViewInit {
  @ViewChild('tab1Ref') tab1Ref!: Tab1Component;
  @ViewChild('tab2Ref') tab2Ref!: Tab2Component;
  
  public readonly activeTabId = signal<string>('tab1');
  public readonly isSaving = signal(false);
  
  // Expose tab references for template
  public get tab1(): Tab1Component | undefined {
    return this.tab1Ref;
  }

  public get tab2(): Tab2Component | undefined {
    return this.tab2Ref;
  }

  // Simple methods instead of broken computed signals
  public getChangesCount(): number {
    let count = 0;
    if (this.tab1Ref?.hasChanges()) count++;
    if (this.tab2Ref?.hasChanges()) count++;
    return count;
  }

  public getCanSave(): boolean {
    const tab1HasChanges = this.tab1Ref?.hasChanges() ?? false;
    const tab2HasChanges = this.tab2Ref?.hasChanges() ?? false;
    const tab1IsValid = this.tab1Ref?.isValid() ?? true;
    const tab2IsValid = this.tab2Ref?.isValid() ?? true;
    
    const changedTabCount = (tab1HasChanges ? 1 : 0) + (tab2HasChanges ? 1 : 0);
    
    if (changedTabCount === 0) {
      return false;
    }
    
    // All changed tabs must be valid
    if (tab1HasChanges && !tab1IsValid) return false;
    if (tab2HasChanges && !tab2IsValid) return false;
    
    return true;
  }
  
  // Fix the timing issue in getAllTabs
  private getAllTabs(): IEditDispatchOrderTab[] {
    const tabs: IEditDispatchOrderTab[] = [];
    // Add null checks to handle timing before ViewChild is set
    if (this.tab1Ref) tabs.push(this.tab1Ref);
    if (this.tab2Ref) tabs.push(this.tab2Ref);
    return tabs;
  }
  
  ngOnInit() {
    // Component initialization
  }
  
  ngAfterViewInit() {
    // Load sample data after view is initialized
    this.loadSampleData();
  }
  
  private loadSampleData() {
    // Simulate loading data from a service
    if (this.tab1Ref) {
      this.tab1Ref.loadData('Initial Value 1', 'Initial Value 2');
    }
    
    if (this.tab2Ref) {
      this.tab2Ref.loadData('This is some longer initial text content', '2025-07-10');
    }
  }
  
  public setActiveTab(tabId: string) {
    this.activeTabId.set(tabId);
  }
  
  public async onSave() {
    if (!this.getCanSave()) {
      return;
    }
    
    this.isSaving.set(true);
    
    try {
      const tabs = this.getAllTabs();
      const tabsToSave = tabs.filter(tab => tab.hasChanges());
      
      console.log(`Saving ${tabsToSave.length} tabs...`);
      
      // Save all changed tabs in parallel
      const savePromises = tabsToSave.map(tab => tab.save());
      await Promise.all(savePromises);
      
      console.log('All tabs saved successfully!');
      
    } catch (error) {
      console.error('Error saving tabs:', error);
    } finally {
      this.isSaving.set(false);
    }
  }
  
  public onClose() {
    const hasUnsavedChanges = this.getChangesCount() > 0;
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        console.log('Dialog closed with unsaved changes');
      }
    } else {
      console.log('Dialog closed');
    }
  }
}