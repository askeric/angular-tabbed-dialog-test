This Angular 19/20 sample demonstrates a scalable multi-tabbed dialog infrastructure using signals, OnPush change detection, and reactive forms. Each tab implements an IEditDispatchOrderTab interface with hasChanges and isValid signals, while the parent dialog computes a canSave signal that enables the save button only when all tabs with changes are valid. The implementation uses reactive forms for automatic validation and change tracking.  See the tab validation, change indicators, and coordinated save functionality in action.

loadSampleData() would be modified to retrieve the service data and initialize the dialogs accordingly.  You can also make some changes and then press the cancel button to illustrate unsaved data handling.

'ng serve' for local testing

or build & deploy to firebase for public testing on https://dialog-ericask.web.app 

ng build --configuration production
firebase deploy