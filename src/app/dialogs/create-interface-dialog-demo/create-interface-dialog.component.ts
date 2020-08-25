import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectPartial } from 'src/app/reducers/projects.actions';
import { ComponentInterface } from 'src/app/reducers/state';

@Component({
    selector: 'app-create-interface-dialog',
    templateUrl: './create-interface-dialog.component.html',
    styleUrls: ['./create-interface-dialog.component.css']
})
export class CreateInterfaceDialogComponent implements OnInit {
    private generalInformation: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.setGeneralInformation();
        this.getInterfaceName();
    }

    public getInterfaceName(): string {
        return this.generalInformation.controls.interfaceName.value;
    }

    private setGeneralInformation(): void {
        this.generalInformation = this.formBuilder.group({
            interfaceName: ['', Validators.required],
        });
    }

    public getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

}
