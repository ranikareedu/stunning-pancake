import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "My Angular App"', () => {
    expect(component.title).toEqual('My Angular App');
  });

  it('should return app name from getAppName()', () => {
    expect(component.getAppName()).toEqual('My Angular App');
  });

  it('should initialize count to 0', () => {
    expect(component.count).toEqual(0);
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count).toEqual(1);
    component.increment();
    expect(component.count).toEqual(2);
  });

  it('should decrement count', () => {
    component.count = 5;
    component.decrement();
    expect(component.count).toEqual(4);
  });

  it('should not decrement below 0', () => {
    component.count = 0;
    component.decrement();
    expect(component.count).toEqual(0);
  });

  it('should reset count to 0', () => {
    component.count = 10;
    component.reset();
    expect(component.count).toEqual(0);
  });

  it('should render title in h1', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('My Angular App');
  });

  it('should render counter buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toEqual(3);
  });
});

