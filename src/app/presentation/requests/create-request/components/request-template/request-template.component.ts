import { Component, Inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/core/domain/category.model';
import { ListItemModel } from 'src/app/core/domain/listItem.model';
import { PaginationFilterModel } from 'src/app/core/domain/models/pagination.filter.model';
import { TemplateModel } from 'src/app/core/domain/template.model';
import { NotificationHelper } from 'src/app/core/helpers/notification/notification.helper';
import { SlugifyHelper } from 'src/app/core/helpers/slugify/slugify.helper';
import { IProductDefinitionService } from 'src/app/core/services/i.product-definition.service';
import { ITemplateService } from 'src/app/core/services/i.template.service';
import { PRODUCTDEFINITION_SERVICE } from 'src/app/service/product-definition.service';
import { TEMPLATE_SERVICE } from 'src/app/service/template.service';

@Component({
  selector: 'app-request-template',
  templateUrl: './request-template.component.html',
  styleUrl: './request-template.component.scss'
})
export class RequestTemplateComponent {
  @Input() formData: {};
  @Input() category: CategoryModel;
  @Input() viewMode: boolean = false;

  private templateIdSubscription: Subscription;
  private isSubscriptionActive: boolean = true;
  private isTemplateDataSubscriptionActive: boolean = true;

  templateList: TemplateModel[];
  templateOptions: ListItemModel[];
  productDefinitionOptions: any[];
  templateForm: FormGroup;
  templateTableForm: FormGroup;

  columns: any[] = [];
  initialColumns: any[] = [];

  visibleAddColumn: boolean;
  showAddColumnError: boolean;
  visibleSaveTemplateName: boolean;
  addColumnName: string;
  templateName: string;
  templateHasChange: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Inject(TEMPLATE_SERVICE) private templateService: ITemplateService,
    @Inject(PRODUCTDEFINITION_SERVICE) private productDefinitionService: IProductDefinitionService,
    private messageService: NotificationHelper,
    private slugifyService: SlugifyHelper
  ) { }

  async ngOnInit() {
    this.initColumns();
    await this.getTemplateList();
    await this.getProductDefinitionList();
    this.createTemplateTableForm();
    this.createTemplateForm();
    if (this.viewMode) {
      this.templateForm.disable();
      this.templateTableForm.disable();
    }
  }

  initColumns() {
    this.columns = [
      {
        title: "Ana Kategori",
        name: 'mainCategory',
        isDeletable: false,
        isDefault: true,
        style: { 'max-width': '130px', 'min-width': '130px' }
      },
      {
        title: "Alt Kategori",
        name: 'subCategory',
        isDeletable: false,
        isDefault: true,
        style: { 'max-width': '250px', 'min-width': '250px' }
      },
      {
        title: "Talep Grubu",
        name: 'requestGroup',
        isDeletable: false,
        isDefault: true,
        style: { 'max-width': '250px', 'min-width': '250px' }
      },
      {
        title: "Talep Lokasyonu",
        name: 'requestLocation',
        isDeletable: false,
        isDefault: true,
        style: { 'max-width': '250px', 'min-width': '250px' }
      }
    ];

    if (this.category.mainCategoryId === 1) {

      this.columns.push(
        {
          title: "Miktar",
          name: 'quantity',
          isDeletable: false,
          isDefault: false,
          style: { 'max-width': '120px', 'min-width': '120px' },
          type: 'number',
        },
        {
          title: "Ürün Kodu / Tanımı",
          name: 'productDefinition',
          isDeletable: false,
          isDefault: false,
          style: { 'min-width': '250px' },
          type: 'dropdown',
        },
      )
    }

    if (this.category.mainCategoryId === 2) {
      this.columns.push(
        {
          title: "Hizmet Sıklığı",
          name: 'serviceFrequency',
          isDeletable: false,
          isDefault: false,
          style: { 'max-width': '180px', 'min-width': '180px' },
          type: 'number'
        },
        {
          title: "Hizmet Tanımı",
          name: 'serviceDefinition',
          isDeletable: false,
          isDefault: false,
          style: { 'max-width': '180px', 'min-width': '180px' }
        },
      )
    }

    this.initialColumns = [...this.columns];
  }

  createTemplateForm() {
    const control = (defaultValue: any, validators: any[] = []) =>
      this.fb.control(defaultValue, { validators });

    this.templateForm = this.fb.group({
      templateId: control(null, [Validators.required]),
    });

    this.templateIdSubscription = this.templateForm.get('templateId')?.valueChanges.subscribe((newValue) => {
      if (this.isSubscriptionActive)
        this.templateChanged(newValue);
    });

    if (this.formData) {
      this.templateForm.patchValue(this.formData)
    }
    else {
      this.addRow();
    }
  }

  createTemplateTableForm() {
    this.templateTableForm = this.fb.group({
      rows: this.fb.array([]),
    });

    this.rows.valueChanges.subscribe((changes) => {
      if (this.isTemplateDataSubscriptionActive)
        this.templateHasChange = true;
    });
  }

  get rows(): FormArray {
    return this.templateTableForm.get("rows") as FormArray;
  }

  getFormGroup(index: number): FormGroup {
    return this.rows.controls[index] as FormGroup;
  }

  async getTemplateList() {
    this.templateList = await this.templateService.getByRequestGroup(this.category.requestGroupId);

    const templateOptions = this.templateList.map(item => ({
      id: item.id,
      name: item.name,
    }));
    const newArray = [{ id: null, name: "Yeni Şablon Oluştur" }, ...templateOptions];
    this.templateOptions = newArray;
  }

  async getProductDefinitionList() {
    const filter = new PaginationFilterModel();
    filter.pageSize = 40;
    const search = { categoryId: this.category.id };
    this.productDefinitionOptions = (await this.productDefinitionService.getPaginationList(filter, search)).items.map(x => ({ id: `${x.code} / ${x.definition}`, name: `${x.code} / ${x.definition}` }));
  }

  templateChanged(value: number) {
    this.removeAllRows();

    if (!value) {
      this.columns = [...this.initialColumns];
      this.addRow()
    }
    else {
      this.setTemplateData(value);
    }
  }

  excelUpload() { }

  addRow() {
    const newRow = this.fb.group({
      mainCategory: [this.category.mainCategoryName, Validators.required],
      subCategory: [this.category.subCategoryName, Validators.required],
      requestGroup: [this.category.requestGroupName, Validators.required],
      requestLocation: [this.category.locationName, Validators.required],
      quantity: ["", Validators.required],
      productDefinition: ["", Validators.required],
      serviceFrequency: ["", Validators.required],
    });

    this.columns.filter(x => x.isDeletable).forEach((column) => {
      if (!newRow.contains(column.name)) {
        newRow.addControl(column.name, this.fb.control("", Validators.required));
      }
    });

    this.rows.push(newRow);
  }

  showAddColumn() {
    this.visibleAddColumn = true;
  }

  addColumn() {
    var columnName = this.slugifyService.generateSlug(this.addColumnName);

    if (!columnName)
      return;

    if (!this.columns.some(x => x.name === columnName)) {
      this.columns.push({ name: columnName, title: this.addColumnName, isDeletable: true });
      this.addColumnName = "";
      if (this.rows.length > 0) {
        this.rows.controls.forEach((row) => {
          (row as FormGroup).addControl(
            columnName,
            this.fb.control("", Validators.required)
          );
        });
      }

      this.visibleAddColumn = false;
      this.showAddColumnError = false;
    }
    else {
      this.showAddColumnError = true;
    }
  }

  removeColumn() {
    if (this.hasDeletableColumn()) {
      const removedColumn = this.columns.pop();
      this.rows.controls.forEach((row) => {
        (row as FormGroup).removeControl(removedColumn.name);
      });
    }
  }

  removeRow() {
    this.rows.removeAt(this.rows.length - 1);
  }

  removeAllRows() {
    this.rows.clear();
  }

  async setTemplateData(templateId: number) {
    const templateData = JSON.parse(this.templateList.find(t => t.id === templateId).data);
    this.columns = templateData.columns;

    this.clearTemplate();

    for (const [index, row] of templateData.rows.entries()) {
      const newRow = this.fb.group({});
      this.columns.forEach(column => {
        newRow.addControl(column.name, this.fb.control((row[column.name]) || "", Validators.required));
      });

      this.rows.push(newRow);
    }

    this.templateHasChange = false;
  }

  hasDeletableColumn(): boolean {
    const lastColumn = this.columns[this.columns.length - 1];
    return lastColumn.isDeletable
  }

  hasDeletableRow(): boolean {
    return this.rows.length > 0;
  }


  deleteTemplate() { }


  initSaveTemplate() {

    if (this.templateForm.get('templateId').value && !this.templateHasChange) {
      this.messageService.showSuccess("Şablon zaten kayıtlı")

      return;
    }

    const data = JSON.stringify({
      rows: this.rows.value,
      columns: this.columns
    });

    if (this.rows.length === 0) {
      this.messageService.showError('Tabloda hiç kayıt yok')

      return;
    }

    this.removeEmptyRows();

    if (this.hasEmptyFields()) {
      this.messageService.showError('Tablodaki tüm alanları doldurmalısınız')

      return;
    }

    const selectedTemplateId = this.templateForm.get('templateId').value;

    if (selectedTemplateId) {
      const selectedTemplate = (this.templateList.find(x => x.id == selectedTemplateId))

      if (data === selectedTemplate.data) {
        this.messageService.showSuccess('Şablon zaten kayıtlı.')

        return;
      }
    }

    this.visibleSaveTemplateName = true;
  }

  checkFormData(): boolean {
    const templateId = this.templateForm.get('templateId').value;

    if (templateId && this.templateHasChange) {
      this.initSaveTemplate();

      return false;
    }

    if (this.templateForm.invalid) {
      this.messageService.showError('Şablonu kayıt etmediniz!')

      return false;
    }


    return this.templateForm.valid;
  }

  async saveTemplate() {

    const templateData = {
      name: this.templateName,
      requestGroupId: this.category.requestGroupId,
      data: JSON.stringify({
        rows: this.rows.value,
        columns: this.columns
      })
    } as TemplateModel;

    await this.templateService.create(templateData);
    await this.getTemplateList();

    const findedTemplate = this.templateList.find(x => x.name === this.templateName);
    this.templateName = "";

    this.templateForm.get('templateId').setValue(findedTemplate.id);
    this.visibleSaveTemplateName = false;
  }

  clearTemplate() {
    this.rows.controls.forEach(row => {
      Object.keys(row.value).forEach(key => {
        if (this.columns.find(x => x.name === key && !x.isDefault)) {
          row.get(key)?.setValue('');
        }
      });
    });
  }

  clearTemplateHandle() {
    this.isSubscriptionActive = false;

    this.clearTemplate();

    this.templateForm.reset();

    setTimeout(() => {
      this.isSubscriptionActive = true;
    }, 300)
  }

  removeEmptyRows() {
    for (let i = this.rows.controls.length - 1; i >= 1; i--) {
      const group = this.rows.controls[i] as FormGroup;

      const allEmpty = this.columns
        .filter(column => !column.isDefault)
        .every(column => !group.controls[column.name].value.trim());

      if (allEmpty) {
        this.rows.removeAt(i);
      }
    }

  }

  hasEmptyFields(): boolean {
    return this.rows.controls.some(group => {
      return Object.keys((group as FormGroup).controls).some(key => {
        const control = (group as FormGroup).get(key);
        var k = control?.value === '' && this.columns.some(x => x.name === key);

        return k;
      });
    });
  }

  get selectedTemplateName(): string {
    const finded = this.templateOptions.find(x=> x.id === this.templateForm.get('templateId').value)

    return finded.name;
  }
}
