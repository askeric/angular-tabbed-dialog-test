import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal, ViewChild, computed, ChangeDetectionStrategy } from '@angular/core';
import { Tab1Component } from '../tab1/tab1';
import { Tab2Component } from '../tab2/tab2';
import { IEditDispatchOrderTab } from '../../interface/IEditDispatchOrderTab';

@Component({
  selector: 'app-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'dialog.html',
  styleUrl: 'dialog.scss',
  standalone: true,
  imports: [CommonModule, Tab1Component, Tab2Component]
})
export class DialogComponent implements OnInit, AfterViewInit {
  @ViewChild('tab1Ref') tab1Ref!: Tab1Component;
  @ViewChild('tab2Ref') tab2Ref!: Tab2Component;
  
  public readonly activeTabId = signal<string>('tab1');
  public readonly isSaving = signal(false);
  
  // Private signal to track when ViewChild refs are ready
  private readonly _tabsReady = signal(false);
  
  // Computed signals that wait for ViewChild to be ready
  public readonly tabsWithChangesCount = computed(() => {
    if (!this._tabsReady()) return 0; // Wait until ViewChild is ready
    
    let count = 0;
    if (this.tab1Ref?.hasChanges()) count++;
    if (this.tab2Ref?.hasChanges()) count++;
    return count;
  });

  public readonly canSave = computed(() => {
    if (!this._tabsReady()) return false; // Wait until ViewChild is ready
    
    // TODO: make these arrays
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
  });
  
  // Expose tab references for template
  public get tab1(): Tab1Component | undefined {
    return this.tab1Ref;
  }

  public get tab2(): Tab2Component | undefined {
    return this.tab2Ref;
  }
  
  private getAllTabs(): IEditDispatchOrderTab[] {
    const tabs: IEditDispatchOrderTab[] = [];
    if (this.tab1Ref) tabs.push(this.tab1Ref);
    if (this.tab2Ref) tabs.push(this.tab2Ref);
    return tabs;
  }
  
  ngOnInit() {
    // Component initialization
  }
  
  ngAfterViewInit() {
    // Load sample data first
    this.loadSampleData();
    
    this._tabsReady.set(true);
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
    if (!this.canSave()) {
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
    const hasUnsavedChanges = this.tabsWithChangesCount() > 0;
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        console.log('Dialog closed with unsaved changes');
      }
    } else {
      console.log('Dialog closed');
    }
  }
}