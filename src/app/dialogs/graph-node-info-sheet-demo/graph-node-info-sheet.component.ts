import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Store, select } from '@ngrx/store';
import { State, IssuesState } from 'src/app/reducers/state';
import { selectIssuesState } from 'src/app/reducers/issues.selector';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog-demo/create-issue-dialog.component';
import { EditIssueDialogComponent } from '../edit-issue-dialog-demo/edit-issue-dialog.component';


@Component({
    selector: 'app-graph-node-info-sheet',
    templateUrl: './graph-node-info-sheet.component.html',
    styleUrls: ['./graph-node-info-sheet.component.css']
})
export class GraphNodeInfoSheetComponent implements OnInit {

    issues: IssuesState;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, // to change data input see src/app/graphs/issue-graph/issue-graph.component.ts:733 onNodeClick
        private bottomSheetRef: MatBottomSheetRef<GraphNodeInfoSheetComponent>,
        private store: Store<State>,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.store.pipe(select(selectIssuesState), take(1)).subscribe(issues => {
            this.issues = issues;
        });
    }

    editComponent() {
        this.bottomSheetRef.dismiss();
        // TODO implement
    }

    removeComponent() {
        this.bottomSheetRef.dismiss();
        // TODO implement
    }

    newIssue() {
        this.dialog.open(CreateIssueDialogComponent, {data: this.data.component});
        this.bottomSheetRef.dismiss();
        // TODO implement
    }

    editIssue(issueId: string) {
        this.dialog.open(EditIssueDialogComponent, {
            data: {
                projectId: this.data.projectId,
                component: this.data.component,
                issue: this.issues[issueId]
            }
        });
        this.bottomSheetRef.dismiss();
        // TODO implement
    }
}
