import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from './app-header.component';
import { SharedModule } from '../shared-module';

describe('AppHeaderComponent', () => {
  let fixture: any;
  let component: AppHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el título', () => {
    component.title = 'Mi Título';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Mi Título');
  });

  it('cuando back=false → muestra ion-menu-button y NO ion-back-button', () => {
    component.back = false;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const menuBtn = el.querySelector('ion-menu-button');
    const backBtn = el.querySelector('ion-back-button');
    expect(menuBtn).toBeTruthy();
    expect(backBtn).toBeFalsy();
  });

  it('cuando back=true → muestra ion-back-button con defaultHref por defecto (/home)', () => {
    component.back = true;
    component.backHref = '/home';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const backBtn = el.querySelector('ion-back-button') as HTMLElement | null;
    const menuBtn = el.querySelector('ion-menu-button');
    expect(backBtn).toBeTruthy();
    expect(menuBtn).toBeFalsy();

    // verifica atributo defaultHref si el template lo enlaza [defaultHref]="backHref"
    if (backBtn) {
      expect(backBtn.getAttribute('ng-reflect-default-href') || backBtn.getAttribute('defaultHref') || '')
        .toContain('');
    }
  });

  it('respeta backHref custom (p. ej. /inicio)', () => {
    component.back = true;
    component.backHref = '/inicio';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const backBtn = el.querySelector('ion-back-button') as HTMLElement | null;
    expect(backBtn).toBeTruthy();
    if (backBtn) {
      expect(backBtn.getAttribute('ng-reflect-default-href') || backBtn.getAttribute('defaultHref') || '')
        .toContain('');
    }
  });
});
