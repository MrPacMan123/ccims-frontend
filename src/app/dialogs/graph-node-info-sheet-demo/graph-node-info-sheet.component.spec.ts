import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeInfoSheetComponent } from './graph-node-info-sheet.component';

describe('GraphNodeInfoSheetComponent', () => {
    let component: GraphNodeInfoSheetComponent;
    let fixture: ComponentFixture<GraphNodeInfoSheetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GraphNodeInfoSheetComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphNodeInfoSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
