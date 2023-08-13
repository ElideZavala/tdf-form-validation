import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReleaseLog } from 'src/app/classes/release-log';
import { ReleaseFormComponent } from './release-form.component';

describe('ReleaseFormComponent', () => {
  let component: ReleaseFormComponent;
  let fixture: ComponentFixture<ReleaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReleaseFormComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit a new release log with the correct input values', fakeAsync(async () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    const CALENDAR_APP = component.apps[2]; // se refiere a la posición del array
    spyOn(component.newReleaseLog, 'emit'); // espía el método newReleaseLog.emit
    await fixture.whenStable(); // se asegura de que el componente se haya inicializado
    component.releaseForm.controls['version'].setValue('2.2.2'); // setea el valor de la versión
    component.releaseForm.controls['app'].setValue(CALENDAR_APP); // setea el valor de la app
    submitButton.click(); // hace click en el botón de submit
    const expectedReleaseLog = new ReleaseLog(CALENDAR_APP, '2.2.2'); // crea un nuevo ReleaseLog con los valores esperados
    expect(component.newReleaseLog.emit).toHaveBeenCalledWith(
      expectedReleaseLog
    ); // se asegura de que el método newReleaseLog.emit haya sido llamado con el ReleaseLog esperado
  }));

  it('should submit a new release log with the correct input values', fakeAsync(async () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    const CALENDAR_APP = component.apps[2];
    spyOn(component.newReleaseLog, 'emit');
    await fixture.whenStable(); // se asegura de que el componente se haya inicializado
    const expectedError =
      'Invalid version format or provided. Please provide a valid version as (major.minor.patch)';
    component.releaseForm.controls['version'].setValue('x.x.x'); // setea el valor de la versión
    component.releaseForm.controls['app'].setValue(CALENDAR_APP); // setea el valor de la app
    expect(() => component.formSubmit(component.releaseForm)).toThrowError(
      expectedError
    );
    fixture.detectChanges(); // detecta los cambios en el componente para que se ejecute el método formSubmit
    expect(component.newReleaseLog.emit); // se asegura de que el método newReleaseLog.emit haya sido llamado con el ReleaseLog esperado
    expect(component.newReleaseLog.emit).not.toHaveBeenCalledWith(); // se asegura de que el método newReleaseLog.emit haya sido llamado con el ReleaseLog esperado
  }));

  it("should disable the submit button when we don't have an app selected", fakeAsync(async () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    spyOn(component.newReleaseLog, 'emit'); // espía el método newReleaseLog.emit
    await fixture.whenStable(); // se asegura de que el componente se haya inicializado
    component.releaseForm.controls['version'].setValue('2.2.2'); // setea el valor de la versión
    component.releaseForm.controls['app'].setValue(null); // setea el valor de la app
    fixture.detectChanges(); // detecta los cambios en el componente para que se ejecute el método formSubmit
    expect(submitButton.hasAttribute('disabled')).toBe(true); // se asegura de que el botón de submit esté deshabilitado
    expect(component.newReleaseLog.emit).not.toHaveBeenCalled(); // se asegura de que el método newReleaseLog.emit no haya sido llamado
  }));
});
